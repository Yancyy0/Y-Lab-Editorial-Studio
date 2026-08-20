import ModuleHeader from "../ModuleHeader";

const reviewTools = [
  {
    id: "github",
    title: "Skill",
    href: "https://github.com/yancyforw-max/SAB-news-audit-skill",
    features: ["本地部署", "Agent调用"],
    guide: "https://hcnwz7yz594b.feishu.cn/docx/ETaodw0yRo1EPRxkIJWcFt4Cnse",
  },
  {
    id: "coze",
    title: "对话智能体",
    href: "https://www.coze.cn/store/agent/7670800816265199651?bot_id=true",
    features: ["网页访问", "快速调用"],
    guide: "https://hcnwz7yz594b.feishu.cn/docx/MiEYde8CRoSxVjx9O1bc27kon4f",
  },
  {
    id: "layout",
    title: "AI排版",
    href: "https://xiumi.us/#/",
    features: ["复制使用", "一键排版"],
    guide: "https://weixing.feishu.cn/docx/E8yrdhTOVoH484x1lwVcUndRnad?from=from_copylink",
  },
] as const;

export default function ReviewPage() {
  return (
    <main className="annual-page review-page">
      <ModuleHeader activeSection="review" />

      <section className="review-hero" aria-labelledby="review-title">
        <h1 id="review-title" className="review-title">
          <span>稿件审校</span>
          <span>CONTENT REVIEW</span>
        </h1>
      </section>

      <section className="review-entry" aria-label="稿件审校工具">
        <div className="review-wallets">
          {reviewTools.map((tool) => (
            <article className={`review-wallet review-wallet--${tool.id}`} key={tool.id}>
              <div className="review-wallet__stage">
                <div className="review-wallet__back" aria-hidden="true" />

                <div className="review-tool-card">
                  <a
                    className="review-tool-card__main"
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`在新标签页打开${tool.title}`}
                  >
                    <h2>{tool.title}</h2>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <div className="review-tool-card__details">
                    {tool.features.map((feature) => (
                      <span className="review-tool-card__feature" key={feature}>
                        {feature}
                      </span>
                    ))}

                    <a href={tool.guide} target="_blank" rel="noreferrer">
                      <span>使用说明</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>

                <div className="review-pocket" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
