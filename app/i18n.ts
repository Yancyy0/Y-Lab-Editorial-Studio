export const locales = ["zh-CN", "en", "vi", "bn"] as const;

export type Locale = (typeof locales)[number];
export type WorkspaceSection = "annual" | "tools" | "review" | "assets";

type WorkspaceCopy = {
  brand: string;
  title: string;
  titleEnglish: string;
  placeholder: string;
  placeholderEnglish: string;
  commandStatus: {
    select: string;
    selected: string;
    ready: string;
    opening: string;
  };
  navigation: Record<WorkspaceSection, string>;
};

export const workspaceCopy: Record<Locale, WorkspaceCopy> = {
  "zh-CN": {
    brand: "Yancy's Lab",
    title: "宣传工作台",
    titleEnglish: "Editorial Studio",
    placeholder: "点击导航栏进入",
    placeholderEnglish: "CLICK THE NAVIGATION",
    commandStatus: {
      select: "SELECT A DIRECTORY",
      selected: "COMMAND SELECTED — WATCH THE KEYS",
      ready: "PRESS ENTER TO OPEN",
      opening: "OPENING DIRECTORY",
    },
    navigation: {
      annual: "年度宣传",
      tools: "工具清单",
      review: "稿件审校",
      assets: "物料素材",
    },
  },
  en: {
    brand: "Yancy's Lab",
    title: "Editorial Studio",
    titleEnglish: "Editorial Studio",
    placeholder: "Click the navigation",
    placeholderEnglish: "CLICK THE NAVIGATION",
    commandStatus: {
      select: "SELECT A DIRECTORY",
      selected: "COMMAND SELECTED — WATCH THE KEYS",
      ready: "PRESS ENTER TO OPEN",
      opening: "OPENING DIRECTORY",
    },
    navigation: {
      annual: "Annual Campaigns",
      tools: "Tools",
      review: "Editorial Review",
      assets: "Assets",
    },
  },
  vi: {
    brand: "Yancy's Lab",
    title: "Không gian truyền thông",
    titleEnglish: "Editorial Studio",
    placeholder: "Nhấp vào thanh điều hướng",
    placeholderEnglish: "CLICK THE NAVIGATION",
    commandStatus: {
      select: "SELECT A DIRECTORY",
      selected: "COMMAND SELECTED — WATCH THE KEYS",
      ready: "PRESS ENTER TO OPEN",
      opening: "OPENING DIRECTORY",
    },
    navigation: {
      annual: "Truyền thông năm",
      tools: "Công cụ",
      review: "Duyệt bản thảo",
      assets: "Tư liệu",
    },
  },
  bn: {
    brand: "Yancy's Lab",
    title: "যোগাযোগ কর্মক্ষেত্র",
    titleEnglish: "Editorial Studio",
    placeholder: "নেভিগেশন বারে ক্লিক করুন",
    placeholderEnglish: "CLICK THE NAVIGATION",
    commandStatus: {
      select: "SELECT A DIRECTORY",
      selected: "COMMAND SELECTED — WATCH THE KEYS",
      ready: "PRESS ENTER TO OPEN",
      opening: "OPENING DIRECTORY",
    },
    navigation: {
      annual: "বার্ষিক প্রচার",
      tools: "টুল তালিকা",
      review: "খসড়া পর্যালোচনা",
      assets: "উপকরণ",
    },
  },
};

export const sectionCommands: Record<WorkspaceSection, string> = {
  annual: "annual",
  tools: "tools",
  review: "review",
  assets: "assets",
};
