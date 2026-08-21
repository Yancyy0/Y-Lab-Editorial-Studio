import type { Metadata } from "next";
import MethodGuidePage from "../MethodGuidePage";
import { getMethodGuide } from "../methods";

export const metadata: Metadata = { title: "宣传摄影指南 · Yancy's Lab" };

export default function Page() {
  return <MethodGuidePage guide={getMethodGuide("editorial-photography")} />;
}
