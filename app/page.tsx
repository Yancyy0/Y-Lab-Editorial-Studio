"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ModelViewer from "./ModelViewer";
import {
  type WorkspaceSection,
  workspaceCopy,
} from "./i18n";

const locale = "zh-CN" as const;
const copy = workspaceCopy[locale];

type DirectoryItem = {
  id: WorkspaceSection;
  title: string;
  command: string;
  target: string;
};

type KeyPulse = {
  key: string;
  sequence: number;
};

const directoryItems: DirectoryItem[] = [
  { id: "annual", title: copy.navigation.annual, command: "annual", target: "/annual" },
  { id: "tools", title: copy.navigation.tools, command: "tools", target: "/tools" },
  { id: "review", title: copy.navigation.review, command: "review", target: "/review" },
  { id: "assets", title: copy.navigation.assets, command: "assets", target: "/assets" },
];

export default function Home() {
  const [typedCommand, setTypedCommand] = useState("");
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [selectedDirectory, setSelectedDirectory] =
    useState<DirectoryItem | null>(null);
  const [status, setStatus] = useState(copy.commandStatus.select);
  const [keyPulse, setKeyPulse] = useState<KeyPulse | null>(null);
  const animationTimers = useRef<number[]>([]);
  const keyReleaseTimers = useRef<Map<string, number>>(new Map());
  const pulseSequence = useRef(0);
  const terminalRef = useRef<HTMLInputElement>(null);

  const clearAnimationTimers = useCallback(() => {
    animationTimers.current.forEach(window.clearTimeout);
    animationTimers.current = [];
  }, []);

  const pulseKey = useCallback((key: string) => {
    const normalizedKey = key.toLowerCase();
    const previousReleaseTimer = keyReleaseTimers.current.get(normalizedKey);
    if (previousReleaseTimer) window.clearTimeout(previousReleaseTimer);

    setActiveKeys((current) => [
      ...current.filter((item) => item !== normalizedKey),
      normalizedKey,
    ]);
    pulseSequence.current += 1;
    setKeyPulse({ key: normalizedKey, sequence: pulseSequence.current });

    const releaseTimer = window.setTimeout(() => {
      setActiveKeys((current) =>
        current.filter((item) => item !== normalizedKey),
      );
      keyReleaseTimers.current.delete(normalizedKey);
    }, 200);
    keyReleaseTimers.current.set(normalizedKey, releaseTimer);
  }, []);

  useEffect(() => {
    const releaseTimers = keyReleaseTimers.current;
    return () => {
      clearAnimationTimers();
      releaseTimers.forEach(window.clearTimeout);
      releaseTimers.clear();
    };
  }, [clearAnimationTimers]);

  const playDirectoryCommand = useCallback((item: DirectoryItem) => {
    clearAnimationTimers();

    setSelectedDirectory(item);
    setTypedCommand("");
    setActiveKeys([]);
    setStatus(copy.commandStatus.selected);
    window.requestAnimationFrame(() => terminalRef.current?.focus());

    item.command.split("").forEach((letter, index) => {
      const timer = window.setTimeout(() => {
        pulseKey(letter);
        setTypedCommand(item.command.slice(0, index + 1));

        if (index === item.command.length - 1) {
          setStatus(copy.commandStatus.ready);

          const enterTimer = window.setTimeout(() => {
            pulseKey("enter");
            setStatus(copy.commandStatus.opening);

            const navigationTimer = window.setTimeout(() => {
              window.location.assign(item.target);
            }, 300);
            animationTimers.current.push(navigationTimer);
          }, 180);
          animationTimers.current.push(enterTimer);
        }
      }, 80 * (index + 1));

      animationTimers.current.push(timer);
    });
  }, [clearAnimationTimers, pulseKey]);

  return (
    <main className="keyboard-page">
      <header className="site-header">
        <span className="wordmark" data-i18n-key="brand">
          {copy.brand}
        </span>

        <section
          className="command-terminal"
          aria-label="键盘指令输入终端"
          data-active-keys={activeKeys.join(" ")}
        >
          <label className={`search-label ${typedCommand ? "has-value" : ""}`}>
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>

            <input
              ref={terminalRef}
              value={typedCommand}
              aria-label={copy.placeholder}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                clearAnimationTimers();
                const nextCommand = event.target.value.toLowerCase();
                const latestLetter = nextCommand.at(-1);
                setTypedCommand(nextCommand);
                if (latestLetter) pulseKey(latestLetter);
                setStatus(
                  !selectedDirectory
                    ? copy.commandStatus.select
                    : nextCommand === selectedDirectory.command
                      ? copy.commandStatus.ready
                      : copy.commandStatus.selected,
                );
              }}
            />

            {!typedCommand && (
              <span className="terminal-placeholder">
                <span data-i18n-key="placeholder">{copy.placeholder}</span>
                <span data-i18n-key="placeholderEnglish">
                  {copy.placeholderEnglish}
                </span>
                <span className="terminal-idle-caret" aria-hidden="true">
                  ｜
                </span>
              </span>
            )}
          </label>

          <span className="visually-hidden" aria-live="polite">
            {status}
          </span>
        </section>

        <nav className="site-navigation" aria-label="内容目录">
          {directoryItems.map((item) => (
            <button
              key={item.id}
              className={selectedDirectory?.id === item.id ? "is-active" : ""}
              type="button"
              aria-pressed={selectedDirectory?.id === item.id}
              data-i18n-key={`navigation.${item.id}`}
              onClick={() => playDirectoryCommand(item)}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </header>

      <section className="keyboard-hero" aria-labelledby="page-title">
        <h1 id="page-title" className="hero-title">
          <span className="hero-title__primary" data-i18n-key="title">
            {copy.title}
          </span>
          <span className="hero-title__secondary" data-i18n-key="titleEnglish">
            {copy.titleEnglish}
          </span>
        </h1>

        <div className="viewer-stage">
          <ModelViewer
            url="/models/premium_keyboard_skyblue_v4.glb"
            width="100%"
            height="100%"
            keyPulse={keyPulse}
          />
        </div>
      </section>
    </main>
  );
}
