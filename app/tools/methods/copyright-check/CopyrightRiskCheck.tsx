"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const toolLinks = {
  Pexels: "https://www.pexels.com/zh-cn/",
  Unsplash: "https://unsplash.com/",
  "100font": "https://www.100font.com/",
  字由: "https://www.hellofont.cn/",
  爱给网: "https://www.aigei.com/",
  Chosic: "https://www.chosic.com/",
  Mixkit: "https://mixkit.co/",
  LiblibAI: "https://www.liblib.art/",
  即梦AI: "https://jimeng.jianying.com/",
} as const;

type ToolName = keyof typeof toolLinks;
type SourceCategory = "图片" | "音乐" | "字体" | "肖像";

const riskScenes: Array<{
  number: string;
  title: string;
  pitfall: string;
  reminder: string;
  tools: ToolName[];
  level: number;
  isNew?: boolean;
}> = [
  { number: "01", title: "海报 / 公众号配图", pitfall: "未经授权使用摄影、美术作品", reminder: "可能侵犯复制权、信息网络传播权", tools: ["Pexels", "Unsplash"], level: 3 },
  { number: "02", title: "字体使用", pitfall: "非法用字库、复制独创性单字", reminder: "字体不是免费的，商用需授权", tools: ["100font", "字由"], level: 5 },
  { number: "03", title: "视频背景音乐", pitfall: "未取得音乐授权或引用过长", reminder: "短视频 BGM 也要授权", tools: ["爱给网", "Chosic", "Mixkit"], level: 3 },
  { number: "04", title: "转发 / 剪辑短视频", pitfall: "未经许可复制传播，未标注作者", reminder: "转发不等于免费使用", tools: [], level: 2 },
  { number: "05", title: "员工自行创作", pitfall: "员工享有著作权，企业未约定权属", reminder: "职务作品也要书面约定", tools: [], level: 2 },
  { number: "06", title: "活动征集作品", pitfall: "活动规则未说明企业使用权", reminder: "征集时就写清使用规则", tools: [], level: 2 },
  { number: "07", title: "委托第三方创作", pitfall: "协议未明确著作权归属和范围", reminder: "委托合同必须写清归属", tools: [], level: 3 },
  { number: "08", title: "自行拍摄含肖像", pitfall: "未与肖像权人签书面协议", reminder: "照片使用需要授权", tools: [], level: 3 },
  { number: "09", title: "AI 生成素材", pitfall: "AI 生成内容权属法律尚无明确规定", reminder: "核心素材不建议用 AI 生成，使用需标注", tools: ["LiblibAI", "即梦AI"], level: 5, isNew: true },
];

const sourceTools: Array<{
  category: Exclude<SourceCategory, "肖像">;
  name: ToolName;
  description: string;
}> = [
  { category: "图片", name: "Pexels", description: "免费摄影图片与视频，CC0 授权" },
  { category: "图片", name: "Unsplash", description: "高质量摄影图片，免费商用" },
  { category: "图片", name: "即梦AI", description: "AI 素材，使用需注明" },
  { category: "图片", name: "LiblibAI", description: "AI 素材，使用需注明" },
  { category: "音乐", name: "Mixkit", description: "免费视频素材、音乐与模板" },
  { category: "音乐", name: "爱给网", description: "音效与配乐，免费区可商用" },
  { category: "音乐", name: "Chosic", description: "免费音乐音效，CC BY 可商用" },
  { category: "字体", name: "100font", description: "免费商用字体检索" },
  { category: "字体", name: "字由", description: "字体管理，800+ 商用字体" },
];

const categoryNotes: Record<SourceCategory, string> = {
  图片: "使用 AI 生成素材时需注明；核心品牌素材不建议仅依赖 AI 生成。",
  音乐: "使用背景音乐需同时取得“词曲著作权 + 录音制作者权”两层授权，商用音乐平台通常已包含。",
  字体: "CC0 可免费商用无需署名；CC BY 可免费商用但必须署名；CC BY-NC 禁止商用，企业宣传不可用。",
  肖像: "肖像权与著作权是独立权利，自己拍的照片使用时也需肖像授权。",
};

const checkGroups = [
  {
    code: "A",
    title: "素材来源",
    items: [
      { id: 1, text: "能说清图片、文字、字体、音乐、视频来自哪里", help: "回到工具矩阵重新安全获取", href: "#safe-sources" },
      { id: 2, text: "保存了原始文件、下载记录、创作底稿或授权证明", help: "飞书云文档建立素材库" },
    ],
  },
  {
    code: "B",
    title: "授权范围",
    items: [
      { id: 3, text: "字体允许商业宣传使用", help: "字由 / 100font 检索免费商用授权", href: "#safe-sources" },
      { id: 4, text: "授权允许在网络渠道传播", help: "确认授权书范围" },
      { id: 5, text: "授权允许修改、剪辑或二次制作（如涉及）", help: "确认授权书范围" },
      { id: 6, text: "已按要求署名（如需）", help: "按要求添加署名" },
      { id: 7, text: "未超出使用期限或范围限制", help: "设置授权到期提醒" },
    ],
  },
  {
    code: "C",
    title: "内容权属",
    items: [
      { id: 8, text: "员工作品已通过合同 / 手册明确权属", help: "核对内部合同或员工手册" },
      { id: 9, text: "活动征集作品已在公告中明确企业使用权", help: "核对活动公告与征集规则" },
      { id: 10, text: "委托第三方创作的合同明确著作权归属企业", help: "联系法务确认合同" },
      { id: 11, text: "保留了完整的委托、授权和付款材料", help: "飞书云文档归档" },
    ],
  },
] as const;

const emergencySteps = [
  { number: "01", title: "立即响应", time: "24 小时内", actions: ["停止使用并下架", "保存下架时间证据", "平台端优先处理"] },
  { number: "02", title: "收集材料", time: "48 小时内", actions: ["创作底稿 / 授权文件", "购买记录 / 发布记录", "投诉方权属证明核查"] },
  { number: "03", title: "三步判断法", time: "3 个工作日", actions: ["将整理好的全部材料提交法务部门", "配合法务核查作品权属、授权链条和侵权事实", "等待法务出具处理意见", "根据法务意见执行后续动作"] },
];

function ExternalToolLink({ name }: { name: ToolName }) {
  return (
    <a href={toolLinks[name]} target="_blank" rel="noopener noreferrer" title={`打开${name}官网`}>
      {name}<span aria-hidden="true">↗</span>
    </a>
  );
}

function SectionPager({ current, next }: { current: string; next?: string }) {
  return (
    <nav className="section-pager" aria-label={`第 ${current} 章翻页导航`}>
      <span aria-hidden="true" />
      <strong>Details · {current} / 04</strong>
      {next ? <a href={next}><span>Next</span> →</a> : <span aria-hidden="true" />}
    </nav>
  );
}

export default function CopyrightRiskCheck() {
  const [expandedRisk, setExpandedRisk] = useState<string | null>("02");
  const [activeCategory, setActiveCategory] = useState<SourceCategory>("图片");
  const [checked, setChecked] = useState<Set<number>>(() => new Set());

  const visibleTools = useMemo(
    () => sourceTools.filter((tool) => tool.category === activeCategory),
    [activeCategory],
  );
  const completed = checked.size;
  const remaining = 11 - completed;

  const toggleCheck = (id: number) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main id="top">
      <a className="skip-link" href="#risk-scenes">跳到速查内容</a>
      <header className="hero">
        <div className="guide-site-header">
          <Link className="guide-wordmark" href="/" aria-label="返回 Yancy's Lab 首页"><span>Yancy&apos;s Lab</span><small>Editorial Studio</small></Link>
          <Link className="guide-return" href="/tools">返回工具清单 <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero__layout">
          <div className="hero__content">
            <p className="hero__eyebrow">RIGHTS &amp; USAGE · QUICK CHECK</p>
            <h1>侵权风险速查</h1>
            <p className="hero__subtitle">风险一眼识别，工具直接可用，3分钟完成排查。</p>
            <a className="hero__start" href="#pre-publish">开始自检 <span aria-hidden="true">→</span></a>
          </div>
          <aside className="hero-stats" aria-label="速查内容统计">
            <p><strong>9</strong><span>类风险</span></p>
            <p><strong>11</strong><span>项自检</span></p>
            <p><strong>9</strong><span>个工具</span></p>
          </aside>
        </div>
      </header>

      <nav className="quick-nav" aria-label="速查目录">
        <a href="#risk-scenes"><span>01</span><b>风险场景</b><small>RISK SCENES</small></a>
        <a href="#safe-sources"><span>02</span><b>安全获取</b><small>SAFE SOURCES</small></a>
        <a href="#pre-publish"><span>03</span><b>发布自检</b><small>PRE-PUBLISH</small></a>
        <a href="#emergency"><span>04</span><b>应急处理</b><small>EMERGENCY</small></a>
      </nav>

      <section className="section" id="risk-scenes">
        <div className="section-heading section-heading--split">
          <div><p className="section-kicker">01 · RISK SCENES</p><h2>9类高风险场景，<br />一眼识别</h2></div>
          <p>点击卡片查看踩坑点与风险提醒；有可用工具的场景，可直接前往官网。</p>
        </div>
        <div className="risk-grid">
          {riskScenes.map((risk) => {
            const isOpen = expandedRisk === risk.number;
            return (
              <article className={["risk-card", isOpen && "is-open", risk.isNew && "is-ai"].filter(Boolean).join(" ")} key={risk.number}>
                <button type="button" aria-expanded={isOpen} onClick={() => setExpandedRisk(isOpen ? null : risk.number)}>
                  <span className="risk-card__number">{risk.number}</span>
                  <span className="risk-card__level" aria-label={`风险等级 ${risk.level} 星`}>
                    {Array.from({ length: 5 }, (_, index) => <i className={index < risk.level ? "is-filled" : undefined} key={index} />)}
                  </span>
                  <h3>{risk.title}</h3>
                  <span className="risk-card__toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div className="risk-card__details" hidden={!isOpen}>
                  <dl><div><dt>踩坑点</dt><dd>{risk.pitfall}</dd></div><div><dt>提醒</dt><dd>{risk.reminder}</dd></div></dl>
                  {risk.tools.length > 0 ? <div className="risk-card__tools">{risk.tools.map((tool) => <ExternalToolLink name={tool} key={tool} />)}</div> : <span className="risk-card__no-tool">先核对授权与书面约定</span>}
                </div>
              </article>
            );
          })}
        </div>
        <SectionPager current="01" next="#safe-sources" />
      </section>

      <section className="section section--tinted" id="safe-sources">
        <div className="section-heading section-heading--split">
          <div><p className="section-kicker">02 · SAFE SOURCES</p><h2>按素材类型找工具，<br />直接可用</h2></div>
          <p>先选择素材类型，再打开对应工具官网。使用前仍需核对具体素材的授权说明。</p>
        </div>
        <div className="source-tabs" role="tablist" aria-label="素材类型">
          {(["图片", "音乐", "字体", "肖像"] as const).map((category) => (
            <button type="button" role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "is-active" : undefined} onClick={() => setActiveCategory(category)} key={category}>{category}</button>
          ))}
        </div>
        <div className="source-panel" role="tabpanel" aria-label={`${activeCategory}安全获取工具`}>
          <div className="source-grid">
            {visibleTools.map((tool) => (
              <a className="source-card" href={toolLinks[tool.name]} target="_blank" rel="noopener noreferrer" key={tool.name}>
                <span className="source-card__category">{tool.category}</span><h3>{tool.name}</h3><p>{tool.description}</p><span className="source-card__link">前往使用 ↗</span>
              </a>
            ))}
            {activeCategory === "肖像" && <div className="source-empty"><span>PORTRAIT RIGHTS</span><h3>先取得肖像授权</h3><p>自己拍摄不代表可以直接发布；请同步保留授权范围与使用记录。</p></div>}
          </div>
          <aside className="source-note"><strong>{activeCategory}提示</strong><p>{categoryNotes[activeCategory]}</p></aside>
        </div>
        <SectionPager current="02" next="#pre-publish" />
      </section>

      <section className="section" id="pre-publish">
        <div className="section-heading section-heading--split">
          <div><p className="section-kicker">03 · PRE-PUBLISH</p><h2>11项可勾选清单，<br />全部通过再发布</h2></div>
          <p>逐项确认来源、授权范围和内容权属，实时查看完成进度。</p>
        </div>
        <div className={["check-progress", completed === 11 && "is-complete"].filter(Boolean).join(" ")}>
          <div><span>发布前完成度</span><strong>{completed}<small>/11</small></strong></div>
          <div className="check-progress__track" aria-label={`已完成 ${completed} 项，共 11 项`}><span style={{ width: `${(completed / 11) * 100}%` }} /></div>
          <p>{completed === 11 ? "可以发布 ✓" : `还有 ${remaining} 项需处理`}</p>
        </div>
        <div className="check-groups">
          {checkGroups.map((group) => (
            <details open key={group.code}>
              <summary><span>{group.code}</span><b>{group.title}</b><small>{group.items.filter((item) => checked.has(item.id)).length}/{group.items.length}</small></summary>
              <div className="check-list">
                {group.items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <article className={isChecked ? "is-checked" : undefined} key={item.id}>
                      <label><input type="checkbox" checked={isChecked} onChange={() => toggleCheck(item.id)} /><span className="check-list__box" aria-hidden="true">{isChecked ? "✓" : ""}</span><small>{String(item.id).padStart(2, "0")}</small><b>{item.text}</b></label>
                      {item.href ? <a className="check-list__help" href={item.href}>怎么办 · {item.help} →</a> : <span className="check-list__help">怎么办 · {item.help}</span>}
                    </article>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
        <SectionPager current="03" next="#emergency" />
      </section>

      <section className="emergency" id="emergency">
        <div className="emergency__inner">
          <div className="section-heading section-heading--split">
            <div><p className="section-kicker">04 · EMERGENCY</p><h2>收到侵权投诉怎么办？<br />按流程走</h2></div>
            <p>先停止风险扩散并保存证据，再收集材料提交法务部门核查。</p>
          </div>
          <div className="emergency-flow">
            {emergencySteps.map((step) => (
              <article key={step.number}><header><span>{step.number}</span><strong>{step.time}</strong></header><h3>{step.title}</h3><ol>{step.actions.map((action) => <li key={action}>{action}</li>)}</ol></article>
            ))}
          </div>
          <SectionPager current="04" />
        </div>
      </section>
      <footer><p>侵权风险速查</p><a href="#top">返回顶部 ↑</a></footer>
    </main>
  );
}
