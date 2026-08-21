import ModuleHeader from "../../ModuleHeader";
import type { MethodGuide } from "./methods";

export default function MethodGuidePage({ guide }: { guide: MethodGuide }) {
  return (
    <main className="annual-page method-guide-page">
      <ModuleHeader activeSection="tools" />

      <article className="method-guide">
        <a className="method-guide__back" href="/tools">← 返回工具清单</a>

        <header className="method-guide__hero">
          <div>
            <span className="method-guide__eyebrow">EDITORIAL METHOD · {guide.readingTime}</span>
            <h1>{guide.title}</h1>
            <p>{guide.englishTitle}</p>
          </div>
          <span className="method-guide__mark" aria-hidden="true">M</span>
        </header>

        <p className="method-guide__lead">{guide.lead}</p>

        <div className="method-guide__sections">
          {guide.sections.map((section) => (
            <section className="method-guide__section" key={section.number}>
              <span>{section.number}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.summary}</p>
                <ul>
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <aside className="method-checklist" aria-labelledby="method-checklist-title">
          <div>
            <span>BEFORE PUBLISHING</span>
            <h2 id="method-checklist-title">交付前快速检查</h2>
          </div>
          <ol>
            {guide.checklist.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </aside>
      </article>
    </main>
  );
}
