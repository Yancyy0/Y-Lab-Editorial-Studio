import type { Metadata } from "next";
import MethodGuidePage from "../MethodGuidePage";
import { getMethodGuide } from "../methods";

export const metadata: Metadata = { title: "新闻写作指南 · Yancy's Lab" };

export default function Page() {
  return <MethodGuidePage guide={getMethodGuide("news-writing")} />;
}
