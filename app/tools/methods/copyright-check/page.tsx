import type { Metadata } from "next";
import CopyrightRiskCheck from "./CopyrightRiskCheck";

export const metadata: Metadata = {
  title: "侵权风险速查",
  description: "风险一眼识别，工具直接可用，3分钟完成排查。",
};

export default function Page() {
  return <CopyrightRiskCheck />;
}
