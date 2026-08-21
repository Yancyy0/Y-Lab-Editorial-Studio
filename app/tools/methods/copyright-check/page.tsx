import type { Metadata } from "next";
import MethodGuidePage from "../MethodGuidePage";
import { getMethodGuide } from "../methods";

export const metadata: Metadata = { title: "侵权风险速查 · Yancy's Lab" };

export default function Page() {
  return <MethodGuidePage guide={getMethodGuide("copyright-check")} />;
}
