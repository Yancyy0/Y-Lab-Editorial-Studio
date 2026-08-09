import type { WorkspaceSection } from "./i18n";

type ModuleHeaderProps = {
  activeSection: WorkspaceSection;
};

const moduleLinks: Array<{
  id: WorkspaceSection;
  label: string;
  href: string;
}> = [
  { id: "annual", label: "年度宣传", href: "/annual" },
  { id: "tools", label: "工具清单", href: "/tools" },
  { id: "review", label: "稿件审校", href: "/review" },
  { id: "assets", label: "物料素材", href: "/assets" },
];

export default function ModuleHeader({ activeSection }: ModuleHeaderProps) {
  return (
    <header className="annual-site-header">
      <a className="annual-wordmark" href="/" aria-label="返回首页">
        <span>Yancy&apos;s Lab</span>
        <span>Editorial Studio</span>
      </a>

      <nav className="annual-navigation" aria-label="内容导航">
        {moduleLinks.map((item) => (
          <a
            className={activeSection === item.id ? "is-active" : undefined}
            href={item.href}
            aria-current={activeSection === item.id ? "page" : undefined}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
