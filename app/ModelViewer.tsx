"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type ModelViewerProps = {
  url: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  keyPulse?: { key: string; sequence: number } | null;
  onEnter?: () => void;
};

type PermissionAwareOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const toCssSize = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const interactiveKeyCenters: Record<string, [number, number]> = {
  w: [-0.109, 0.033],
  e: [-0.09, 0.033],
  r: [-0.071, 0.033],
  t: [-0.052, 0.033],
  u: [-0.014, 0.033],
  i: [0.005, 0.033],
  o: [0.024, 0.033],
  a: [-0.138, 0.012],
  s: [-0.119, 0.012],
  l: [0.014, 0.012],
  v: [-0.085, -0.009],
  n: [-0.047, -0.009],
  enter: [0.17, 0.001],
};

type ColorMaterial = THREE.Material & {
  color?: THREE.Color;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
};

type AnimatedMaterial = {
  material: ColorMaterial;
  baseColor?: THREE.Color;
  baseEmissive?: THREE.Color;
  baseEmissiveIntensity?: number;
};

type AnimatedKey = {
  group: THREE.Group;
  materials: AnimatedMaterial[];
  startedAt: number | null;
};

const addKeycapSideContrast = (
  geometry: THREE.BufferGeometry,
  materialName: "cap_white" | "cap_blue",
) => {
  const normals = geometry.getAttribute("normal");
  if (!normals) return;

  const sideShade = materialName === "cap_white" ? 0.62 : 0.72;
  const colors = new Float32Array(normals.count * 3);

  for (let index = 0; index < normals.count; index += 1) {
    const upwardNormal = clamp(normals.getY(index), 0, 1);
    const topBlend = THREE.MathUtils.smoothstep(upwardNormal, 0.18, 0.88);
    const directionalShade = clamp(
      1 - Math.max(0, normals.getX(index) * 0.08 + normals.getZ(index) * 0.12),
      0.88,
      1,
    );
    const brightness =
      THREE.MathUtils.lerp(sideShade, 1, topBlend) * directionalShade;
    colors[index * 3] = brightness;
    colors[index * 3 + 1] = brightness;
    colors[index * 3 + 2] = brightness;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
};

const splitMeshIntoInteractiveKeys = (
  sourceMesh: THREE.Mesh,
  keyGroups: Map<string, THREE.Group>,
  allowedKeys: Set<string>,
  markAsCap: boolean,
) => {
  const sourceGeometry = sourceMesh.geometry;
  const position = sourceGeometry.getAttribute("position");
  if (!position || position.count === 0) return;

  const sourceIndex = sourceGeometry.index;
  const indices = sourceIndex
    ? Array.from(sourceIndex.array, Number)
    : Array.from({ length: position.count }, (_, index) => index);
  const parents = new Int32Array(position.count);
  for (let index = 0; index < parents.length; index += 1) parents[index] = index;

  const find = (index: number): number => {
    let root = index;
    while (parents[root] !== root) root = parents[root];
    while (parents[index] !== index) {
      const next = parents[index];
      parents[index] = root;
      index = next;
    }
    return root;
  };

  const union = (left: number, right: number) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
  };

  const coincidentVertices = new Map<string, number>();
  for (let index = 0; index < position.count; index += 1) {
    const coordinateKey = [
      position.getX(index),
      position.getY(index),
      position.getZ(index),
    ]
      .map((value) => value.toFixed(5))
      .join(",");
    const previous = coincidentVertices.get(coordinateKey);
    if (previous == null) coincidentVertices.set(coordinateKey, index);
    else union(index, previous);
  }

  for (let index = 0; index < indices.length; index += 3) {
    union(indices[index], indices[index + 1]);
    union(indices[index + 1], indices[index + 2]);
  }

  type GeometryComponent = {
    indices: number[];
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };

  const components = new Map<number, GeometryComponent>();
  for (let index = 0; index < indices.length; index += 3) {
    const triangle = [indices[index], indices[index + 1], indices[index + 2]];
    const root = find(triangle[0]);
    const component = components.get(root) ?? {
      indices: [],
      minX: Infinity,
      maxX: -Infinity,
      minZ: Infinity,
      maxZ: -Infinity,
    };
    component.indices.push(...triangle);
    for (const vertex of triangle) {
      component.minX = Math.min(component.minX, position.getX(vertex));
      component.maxX = Math.max(component.maxX, position.getX(vertex));
      component.minZ = Math.min(component.minZ, position.getZ(vertex));
      component.maxZ = Math.max(component.maxZ, position.getZ(vertex));
    }
    components.set(root, component);
  }

  const selectedIndices = new Map<string, number[]>();
  const remainingIndices: number[] = [];

  for (const component of components.values()) {
    const centerX = (component.minX + component.maxX) / 2;
    const centerZ = (component.minZ + component.maxZ) / 2;
    let matchedKey: string | null = null;
    let closestDistance = Infinity;

    for (const [key, [keyX, keyZ]] of Object.entries(interactiveKeyCenters)) {
      if (!allowedKeys.has(key)) continue;
      const distance = Math.hypot(centerX - keyX, centerZ - keyZ);
      if (distance < closestDistance) {
        closestDistance = distance;
        matchedKey = key;
      }
    }

    if (matchedKey && closestDistance < 0.0035) {
      selectedIndices.set(matchedKey, [
        ...(selectedIndices.get(matchedKey) ?? []),
        ...component.indices,
      ]);
    } else {
      remainingIndices.push(...component.indices);
    }
  }

  if (selectedIndices.size === 0 || !sourceMesh.parent) return;

  const remainingGeometry = sourceGeometry.clone();
  remainingGeometry.setIndex(remainingIndices);
  sourceMesh.geometry = remainingGeometry;

  for (const [key, keyIndices] of selectedIndices) {
    let keyGroup = keyGroups.get(key);
    if (!keyGroup) {
      keyGroup = new THREE.Group();
      keyGroup.name = `InteractiveKey_${key}`;
      sourceMesh.parent.add(keyGroup);
      keyGroups.set(key, keyGroup);
    }

    const keyGeometry = sourceGeometry.clone();
    keyGeometry.setIndex(keyIndices);
    keyGeometry.computeBoundingSphere();

    const sourceMaterial = Array.isArray(sourceMesh.material)
      ? sourceMesh.material[0]
      : sourceMesh.material;
    const keyMaterial = sourceMaterial.clone();
    const keyMesh = new THREE.Mesh(keyGeometry, keyMaterial);
    keyMesh.name = `${markAsCap ? "Keycap" : "Legend"}_${key}`;
    keyMesh.position.copy(sourceMesh.position);
    keyMesh.quaternion.copy(sourceMesh.quaternion);
    keyMesh.scale.copy(sourceMesh.scale);
    keyMesh.castShadow = markAsCap;
    keyMesh.receiveShadow = true;
    keyMesh.userData.interactiveKey = key;
    keyMesh.userData.isInteractiveCap = markAsCap;
    keyGroup.add(keyMesh);
  }

  sourceGeometry.dispose();
};

export default function ModelViewer({
  url,
  width = "100%",
  height = "100%",
  className = "",
  keyPulse = null,
  onEnter,
}: ModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const requestMotionRef = useRef<() => Promise<void>>(async () => {});
  const pulseModelKeyRef = useRef<(key: string) => void>(() => {});
  const onEnterRef = useRef(onEnter);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [canRequestMotion, setCanRequestMotion] = useState(false);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (keyPulse) pulseModelKeyRef.current(keyPulse.key);
  }, [keyPulse]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let frameId = 0;
    let loadFadeTimer: ReturnType<typeof setTimeout> | undefined;
    let orientationAttached = false;
    let gyroActive = false;
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;
    const animatedKeys = new Map<string, AnimatedKey>();
    const enterHitTargets: THREE.Object3D[] = [];

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 20);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isCoarsePointer,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isCoarsePointer ? 1.35 : 1.75),
    );
    renderer.domElement.setAttribute(
      "aria-label",
      "可随鼠标或手机方向轻微转动的天蓝色机械键盘 3D 模型",
    );
    renderer.domElement.setAttribute("role", "img");
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const environmentMap = pmrem.fromScene(environment, 0.035).texture;
    scene.environment = environmentMap;
    environment.dispose();

    const hemisphere = new THREE.HemisphereLight(0xeaf7ff, 0xc8b8aa, 0.72);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xfff8ef, 4.8);
    keyLight.position.set(-2.8, 2.2, 2.4);
    keyLight.castShadow = true;
    const shadowMapSize = isCoarsePointer ? 2048 : 4096;
    keyLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    keyLight.shadow.bias = -0.000035;
    keyLight.shadow.normalBias = 0.00012;
    keyLight.shadow.radius = 1.2;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbdeaff, 1.45);
    rimLight.position.set(2.6, 1.2, -2.1);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffd9c9, 0.28, 4);
    fillLight.position.set(-1.4, 0.25, -1.5);
    scene.add(fillLight);

    const pivot = new THREE.Group();
    const content = new THREE.Group();
    pivot.add(content);
    scene.add(pivot);

    const floorMaterial = new THREE.ShadowMaterial({
      color: 0x7c8fa0,
      opacity: 0.2,
      transparent: true,
      depthWrite: false,
    });
    let floor: THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial> | null =
      null;

    const state = {
      yaw: 0,
      pitch: 0,
      yawVelocity: 0,
      pitchVelocity: 0,
      targetYaw: 0,
      targetPitch: 0,
    };

    const maxYaw = THREE.MathUtils.degToRad(18);
    const maxPitch = THREE.MathUtils.degToRad(10);
    const initialYaw = THREE.MathUtils.degToRad(-2.5);
    const initialPitch = THREE.MathUtils.degToRad(-4.5);

    const fitCamera = (size?: THREE.Vector3) => {
      const rect = host.getBoundingClientRect();
      const viewWidth = Math.max(rect.width, 1);
      const viewHeight = Math.max(rect.height, 1);
      camera.aspect = viewWidth / viewHeight;

      if (size) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const widthDistance = (size.x * 0.5) / Math.tan(horizontalFov * 0.5);
        const depthInView = size.z * 0.58;
        const heightInView = size.y + depthInView;
        const heightDistance = (heightInView * 0.5) / Math.tan(verticalFov * 0.5);
        const mobileMargin = camera.aspect < 0.82 ? 1.16 : 1.24;
        const distance = Math.max(widthDistance, heightDistance) * mobileMargin;
        const direction = new THREE.Vector3(0, 0.57, 1).normalize();
        camera.position.copy(direction.multiplyScalar(distance));
        camera.near = Math.max(distance / 100, 0.001);
        camera.far = Math.max(distance * 30, 10);
        camera.lookAt(0, 0, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(viewWidth, viewHeight, false);
    };

    let modelSize: THREE.Vector3 | undefined;
    const resizeObserver = new ResizeObserver(() => fitCamera(modelSize));
    resizeObserver.observe(host);
    fitCamera();

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      state.targetYaw = clamp(x * maxYaw, -maxYaw, maxYaw);
      state.targetPitch = clamp(y * maxPitch, -maxPitch, maxPitch);
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      state.targetYaw = 0;
      state.targetPitch = 0;
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerUp = (event: PointerEvent) => {
      if (enterHitTargets.length === 0) return;
      const rect = host.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.intersectObjects(enterHitTargets, true).length > 0) {
        onEnterRef.current?.();
      }
    };
    host.addEventListener("pointerup", onPointerUp);

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      if (baseBeta == null || baseGamma == null) {
        baseBeta = event.beta;
        baseGamma = event.gamma;
      }
      gyroActive = true;
      const yawDegrees = clamp((event.gamma - baseGamma) * 0.62, -18, 18);
      const pitchDegrees = clamp((event.beta - baseBeta) * 0.42, -10, 10);
      state.targetYaw = THREE.MathUtils.degToRad(yawDegrees);
      state.targetPitch = THREE.MathUtils.degToRad(pitchDegrees);
    };

    const attachOrientation = () => {
      if (orientationAttached) return;
      window.addEventListener("deviceorientation", onOrientation, true);
      orientationAttached = true;
    };

    if (isCoarsePointer && "DeviceOrientationEvent" in window) {
      const OrientationEvent = DeviceOrientationEvent as PermissionAwareOrientationEvent;
      if (typeof OrientationEvent.requestPermission === "function") {
        setCanRequestMotion(true);
        requestMotionRef.current = async () => {
          try {
            const permission = await OrientationEvent.requestPermission?.();
            if (permission === "granted") attachOrientation();
          } catch {
            // The floating fallback remains active when permission is unavailable.
          } finally {
            if (!disposed) setCanRequestMotion(false);
          }
        };
      } else {
        attachOrientation();
      }
    }

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (disposed) return;

        const modelMeshes: THREE.Mesh[] = [];

        gltf.scene.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          modelMeshes.push(child);
          child.castShadow = true;
          child.receiveShadow = true;
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          const capMaterial = materials.find(
            (material) =>
              material.name === "cap_white" || material.name === "cap_blue",
          );
          if (
            capMaterial?.name === "cap_white" ||
            capMaterial?.name === "cap_blue"
          ) {
            addKeycapSideContrast(child.geometry, capMaterial.name);
          }
          for (const material of materials) {
            if ("map" in material && material.map instanceof THREE.Texture) {
              material.map.anisotropy = Math.min(
                8,
                renderer.capabilities.getMaxAnisotropy(),
              );
            }
            if (
              material instanceof THREE.MeshStandardMaterial &&
              (material.name === "cap_white" || material.name === "cap_blue")
            ) {
              material.envMapIntensity =
                material.name === "cap_white" ? 0.55 : 0.65;
              material.roughness =
                material.name === "cap_white" ? 0.62 : 0.52;
              material.vertexColors = true;
              material.needsUpdate = true;
            }
          }
        });

        const keyGroups = new Map<string, THREE.Group>();
        const letterKeys = new Set(
          Object.keys(interactiveKeyCenters).filter((key) => key !== "enter"),
        );
        const enterKey = new Set(["enter"]);

        for (const mesh of modelMeshes) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          const materialNames = materials.map((material) => material.name);

          if (materialNames.includes("cap_white")) {
            splitMeshIntoInteractiveKeys(mesh, keyGroups, letterKeys, true);
          } else if (materialNames.includes("cap_blue")) {
            splitMeshIntoInteractiveKeys(mesh, keyGroups, enterKey, true);
          } else if (materialNames.includes("key_legends")) {
            splitMeshIntoInteractiveKeys(
              mesh,
              keyGroups,
              new Set(Object.keys(interactiveKeyCenters)),
              false,
            );
          }
        }

        for (const [key, group] of keyGroups) {
          const materials: AnimatedMaterial[] = [];
          group.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            if (key === "enter") enterHitTargets.push(object);
            if (!object.userData.isInteractiveCap) return;

            const materialList = Array.isArray(object.material)
              ? object.material
              : [object.material];
            for (const material of materialList) {
              const colorMaterial = material as ColorMaterial;
              materials.push({
                material: colorMaterial,
                baseColor: colorMaterial.color?.clone(),
                baseEmissive: colorMaterial.emissive?.clone(),
                baseEmissiveIntensity: colorMaterial.emissiveIntensity,
              });
            }
          });
          animatedKeys.set(key, { group, materials, startedAt: null });
        }

        pulseModelKeyRef.current = (key) => {
          const animatedKey = animatedKeys.get(key.toLowerCase());
          if (!animatedKey) return;
          animatedKey.group.position.y = 0;
          animatedKey.startedAt = performance.now();
        };

        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const center = bounds.getCenter(new THREE.Vector3());
        modelSize = bounds.getSize(new THREE.Vector3());
        gltf.scene.position.sub(center);
        content.add(gltf.scene);

        const floorDrop =
          modelSize.y * 0.58 + Math.sin(maxPitch) * modelSize.z * 0.55;
        const floorGeometry = new THREE.PlaneGeometry(
          modelSize.x * 1.8,
          modelSize.z * 2.35,
        );
        floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -floorDrop;
        floor.receiveShadow = true;
        scene.add(floor);

        const shadowExtent = Math.max(modelSize.x, modelSize.z) * 0.63;
        keyLight.shadow.camera.left = -shadowExtent;
        keyLight.shadow.camera.right = shadowExtent;
        keyLight.shadow.camera.top = shadowExtent;
        keyLight.shadow.camera.bottom = -shadowExtent;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 8;
        keyLight.shadow.camera.updateProjectionMatrix();

        fitCamera(modelSize);
        setProgress(100);
        loadFadeTimer = setTimeout(() => {
          if (!disposed) setLoaded(true);
        }, 180);
      },
      (event) => {
        if (disposed || !event.total) return;
        setProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      },
      () => {
        if (!disposed) setError(true);
      },
    );

    const pulseColor = new THREE.Color(0x87ceeb);
    let previousTime = performance.now();
    const animate = (time: number) => {
      const dt = Math.min((time - previousTime) / 1000, 1 / 20);
      previousTime = time;

      if (isCoarsePointer && !gyroActive && !reduceMotion) {
        state.targetYaw = Math.sin(time * 0.00042) * THREE.MathUtils.degToRad(4.2);
        state.targetPitch = Math.cos(time * 0.00036) * THREE.MathUtils.degToRad(2.1);
      }

      const stiffness = reduceMotion ? 52 : 34;
      const damping = reduceMotion ? 13 : 8.2;
      state.yawVelocity += (state.targetYaw - state.yaw) * stiffness * dt;
      state.pitchVelocity += (state.targetPitch - state.pitch) * stiffness * dt;
      const drag = Math.exp(-damping * dt);
      state.yawVelocity *= drag;
      state.pitchVelocity *= drag;
      state.yaw += state.yawVelocity * dt;
      state.pitch += state.pitchVelocity * dt;

      const clampedYaw = clamp(state.yaw, -maxYaw, maxYaw);
      const clampedPitch = clamp(state.pitch, -maxPitch, maxPitch);
      if (clampedYaw !== state.yaw) state.yawVelocity = 0;
      if (clampedPitch !== state.pitch) state.pitchVelocity = 0;
      state.yaw = clampedYaw;
      state.pitch = clampedPitch;

      pivot.rotation.set(
        initialPitch + state.pitch,
        initialYaw + state.yaw,
        0,
        "YXZ",
      );

      const pulseDuration = reduceMotion ? 110 : 300;
      for (const animatedKey of animatedKeys.values()) {
        if (animatedKey.startedAt == null) continue;
        const pulseProgress = clamp(
          (time - animatedKey.startedAt) / pulseDuration,
          0,
          1,
        );
        const pulseStrength = Math.sin(Math.PI * pulseProgress);
        animatedKey.group.position.y = reduceMotion ? 0 : pulseStrength * 0.026;

        for (const animatedMaterial of animatedKey.materials) {
          if (animatedMaterial.baseColor && animatedMaterial.material.color) {
            animatedMaterial.material.color
              .copy(animatedMaterial.baseColor)
              .lerp(pulseColor, pulseStrength * 0.58);
          }
          if (animatedMaterial.material.emissive) {
            animatedMaterial.material.emissive.copy(pulseColor);
            animatedMaterial.material.emissiveIntensity = pulseStrength * 0.48;
          }
        }

        if (pulseProgress >= 1) {
          animatedKey.group.position.y = 0;
          animatedKey.startedAt = null;
          for (const animatedMaterial of animatedKey.materials) {
            if (animatedMaterial.baseColor && animatedMaterial.material.color) {
              animatedMaterial.material.color.copy(animatedMaterial.baseColor);
            }
            if (
              animatedMaterial.baseEmissive &&
              animatedMaterial.material.emissive
            ) {
              animatedMaterial.material.emissive.copy(
                animatedMaterial.baseEmissive,
              );
            }
            if (animatedMaterial.baseEmissiveIntensity != null) {
              animatedMaterial.material.emissiveIntensity =
                animatedMaterial.baseEmissiveIntensity;
            }
          }
        }
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (loadFadeTimer) clearTimeout(loadFadeTimer);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerup", onPointerUp);
      if (orientationAttached) {
        window.removeEventListener("deviceorientation", onOrientation, true);
      }
      requestMotionRef.current = async () => {};
      pulseModelKeyRef.current = () => {};
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      });
      environmentMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [url]);

  return (
    <div
      ref={hostRef}
      className={`model-viewer ${loaded ? "is-loaded" : ""} ${className}`}
      style={{ width: toCssSize(width), height: toCssSize(height) }}
    >
      <div className="model-viewer__glow" aria-hidden="true" />

      <div className="model-viewer__loader" aria-live="polite">
        {error ? (
          <span className="model-viewer__fallback" aria-label="当前浏览器无法显示 3D 模型" />
        ) : (
          <span className="model-viewer__progress-track" aria-label={`模型加载 ${progress}%`}>
            <span style={{ width: `${Math.max(progress, 4)}%` }} />
          </span>
        )}
      </div>

      {canRequestMotion && loaded && (
        <button
          className="model-viewer__motion-button"
          type="button"
          aria-label="开启动态感应"
          onClick={() => void requestMotionRef.current()}
        />
      )}
    </div>
  );
}
