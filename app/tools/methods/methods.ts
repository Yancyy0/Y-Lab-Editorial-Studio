export type MethodSlug = "editorial-magazine" | "editorial-photography" | "copyright-check";

export type MethodGuide = {
  slug: MethodSlug;
  href: string;
  title: string;
  englishTitle: string;
  description: string;
  readingTime: string;
  lead: string;
  sections: Array<{
    number: string;
    title: string;
    summary: string;
    points: string[];
  }>;
  checklist: string[];
};

export const methodGuides: MethodGuide[] = [
  {
    slug: "editorial-magazine",
    href: "/tools/methods/editorial-magazine",
    title: "电子刊制作指南",
    englishTitle: "DIGITAL MAGAZINE GUIDE",
    description: "工具怎么选、流程怎么走、互动怎么做。",
    readingTime: "",
    lead: "互动元素是电子刊的核心优势，合理使用可显著提升阅读时长和参与感。",
    sections: [
      { number: "01", title: "电子刊优势", summary: "从制作成本到环保属性，逐项查看电子刊优势。", points: [] },
      { number: "02", title: "工具选型", summary: "工具分类总览与选型决策。", points: [] },
      { number: "03", title: "制作流程", summary: "策划准备、编辑制作、发布校对。", points: [] },
      { number: "04", title: "互动元素", summary: "合理使用可显著提升阅读时长和参与感。", points: [] },
    ],
    checklist: [],
  },
  {
    slug: "editorial-photography",
    href: "/tools/methods/editorial-photography",
    title: "宣传摄影指南",
    englishTitle: "EDITORIAL PHOTOGRAPHY GUIDE",
    description: "用一份基础镜头清单，稳定拍到能用于新闻、海报和内部传播的有效照片。",
    readingTime: "约 5 分钟",
    lead: "宣传摄影的目标不是“拍了很多”，而是完整记录人物、行动和环境，让每张照片都能承担明确的信息功能。",
    sections: [
      { number: "01", title: "拍摄前", summary: "提前确认用途、流程与关键人物。", points: ["明确照片将用于新闻、海报还是资料留档", "列出必须拍到的人物、环节与物料", "检查电量、存储空间、画面比例和现场光线"] },
      { number: "02", title: "基础镜头组", summary: "同一场景至少保留全、中、近三种景别。", points: ["全景交代环境和活动规模", "中景呈现人物关系与行动", "近景捕捉表情、手部动作和品牌细节"] },
      { number: "03", title: "现场拍摄", summary: "优先抓动作与交流，减少僵硬摆拍。", points: ["人物视线和动作尽量形成关系", "注意背景是否杂乱、是否遮挡主体", "重要瞬间连续拍摄，横竖构图各保留一组"] },
      { number: "04", title: "筛选交付", summary: "用“信息完整、画面清楚、情绪自然”筛片。", points: ["先排除闭眼、失焦、重复和表情不佳", "统一亮度、色温与裁切比例", "按场景命名文件并保留原图"] },
    ],
    checklist: ["是否有环境全景", "是否覆盖关键人物和环节", "是否同时拍摄横版与竖版", "背景和品牌标识是否整洁", "人物肖像是否获得合适授权"],
  },
  {
    slug: "copyright-check",
    href: "/tools/methods/copyright-check",
    title: "侵权风险速查",
    englishTitle: "RIGHTS & USAGE QUICK CHECK",
    description: "发布前快速检查图片、字体、音乐、肖像及品牌素材的来源与使用边界。",
    readingTime: "约 4 分钟",
    lead: "“网上能下载”不等于“可以公开使用”。发布前保留来源、授权范围和修改记录，是降低传播风险最有效的基础动作。",
    sections: [
      { number: "01", title: "图片与视频", summary: "确认来源与商用范围，不使用来源不明素材。", points: ["优先使用自有拍摄、已购买或明确可商用素材", "保存素材页面、作者和授权说明截图", "注意编辑使用、广告使用与二次修改的差异"] },
      { number: "02", title: "字体与音乐", summary: "分别核对企业宣传、视频和印刷使用权限。", points: ["确认字体授权是否覆盖企业商用和嵌入场景", "音乐需确认录音与词曲相关使用权限", "不要仅凭“免费下载”判断可以商用"] },
      { number: "03", title: "肖像与个人信息", summary: "公开传播前确认授权和信息最小化。", points: ["可识别人物应知悉照片的发布范围", "涉及未成年人时取得监护人同意", "隐藏身份证号、联系方式、住址等敏感信息"] },
      { number: "04", title: "品牌与引用", summary: "规范使用商标、客户品牌和外部内容。", points: ["不随意改变品牌标识比例、颜色和组合关系", "客户名称、产品与合作信息以已确认口径为准", "引用文字标明出处，避免大段复制原文"] },
    ],
    checklist: ["素材来源是否可追溯", "授权范围是否覆盖当前用途", "肖像和个人信息是否妥善处理", "品牌名称与标识是否规范", "授权凭证是否已经留存"],
  },
];

export function getMethodGuide(slug: MethodSlug) {
  return methodGuides.find((method) => method.slug === slug)!;
}
