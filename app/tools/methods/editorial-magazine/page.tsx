import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "电子刊制作指南",
  description: "工具怎么选、流程怎么走、互动怎么做。",
};

const toolHomepages = {
  云展网: "https://www.yunzhan365.com/",
  FLBOOK: "https://flbook.com.cn/",
  Flipsnack: "https://www.flipsnack.com/",
  Canva可画: "https://www.canva.cn/",
  创客贴: "https://www.chuangkit.com/index.html",
  稿定设计: "https://www.gaoding.com/",
  秀米: "https://xiumi.us/",
  易企秀: "https://www.eqxiu.com/",
  MAKA: "https://www.maka.im/",
} as const;

type ToolName = keyof typeof toolHomepages;

function ToolLink({ name, label = name }: { name: ToolName; label?: string }) {
  return (
    <a
      className="tool-inline-link"
      href={toolHomepages[name]}
      target="_blank"
      rel="noopener noreferrer"
      title={`打开${name}官网`}
      aria-label={`打开${name}官网，新窗口打开`}
    >
      <span>{label}</span><span aria-hidden="true">↗</span>
    </a>
  );
}

const comparisonRows = [
  ["制作成本", "仅需平台会员/免费，零印刷&邮寄成本"],
  ["制作周期", "排版→发布→分享，当天即可上线"],
  ["分发方式", "链接/二维码，微信/飞书一键转发"],
  ["更新修改", "在线修改，链接不变，随时更新"],
  ["互动体验", "可嵌入视频/音频/动画/超链接/弹窗"],
  ["效果追踪", "阅读量/时长/地域/设备/热门页面全可查"],
  ["环保属性", "无实体消耗"],
];

const toolOverviewRows: ReactNode[][] = [
  ["在线翻页平台", <><ToolLink name="云展网" />、<ToolLink name="FLBOOK" />、<ToolLink name="Flipsnack" /></>, "无设计基础", "★☆☆☆☆", "PDF/Word直接导入，模板多，自动生成，自带数据统计"],
  ["专业排版软件", "Adobe InDesign", "有设计基础人员", "★★★★☆", "印刷级精度"],
  ["轻量设计平台", <><ToolLink name="Canva可画" />、<ToolLink name="创客贴" />、<ToolLink name="稿定设计" /></>, "运营/宣传人员", "★★☆☆☆", "拖拽式操作，模板丰富，适合单页/封面/配图"],
  ["H5制作工具", <><ToolLink name="秀米" />、<ToolLink name="易企秀" />、<ToolLink name="MAKA" /></>, "运营/活动宣传", "★★☆☆☆", "动画/交互/表单丰富，适合活动型电子刊"],
];

const decisionRows: ReactNode[][] = [
  ["求快求简", <ToolLink name="云展网" />, "中文界面，PDF一键转翻页"],
  ["求专求精", <>Adobe InDesign + <ToolLink name="云展网" />发布</>, <>AI排版出PDF，<ToolLink name="云展网" />转在线，专业+传播兼顾</>],
  ["有海外读者/需嵌入官网", <ToolLink name="Flipsnack" />, "国际化平台，嵌入代码/邮件分发成熟"],
  ["模板套用", <><ToolLink name="Canva可画" /> + <ToolLink name="云展网" /></>, <><ToolLink name="Canva可画" label="Canva" />做单页设计，<ToolLink name="云展网" />组装成翻页刊</>],
];

const planningRows = [
  ["专题策划", "规划哪些内容适合配视频/音频/链接"],
  ["约稿收稿", "同步收集视频/图片素材，标注可用互动形式"],
  ["封面设计", "电子刊封面需适配手机竖屏，注意二维码/链接预留位"],
  ["广告页", "广告可加跳转链接，直接导流至产品页/报名页"],
];

const editingRows: ReactNode[][] = [
  ["阅稿组稿", "标注哪些段落适合插入互动元素"],
  ["改稿", "电子刊阅读节奏快，文章建议精简，多用小标题和列表"],
  ["刊首语", "可配主编语音/短视频，增强亲切感"],
  ["排版设计", "注意字号，行间距放宽，适配手机阅读"],
  ["互动元素添加", <a className="section-inline-link" href="#interaction" title="跳转到04互动元素">点击查看具体内容</a>],
  ["审核修改", "在线修改，审核反馈高效"],
];

const previewChecklist = (
  <div className="cell-checklists">
    <div>
      <b>互动元素</b>
      <ol>
        <li><strong>视频可播放</strong><span>所有嵌入视频能正常加载播放，音量适中，有封面图</span></li>
        <li><strong>音频可播放</strong><span>所有嵌入音频能正常播放，有播放/暂停控件</span></li>
        <li><strong>链接有效性</strong><span>所有超链接可正常跳转，无死链，跳转目标正确</span></li>
        <li><strong>动画正常</strong><span>翻页/部件动画流畅，不卡顿，不影响阅读</span></li>
      </ol>
    </div>
    <div>
      <b>多端适配</b>
      <ol>
        <li><strong>手机端适配</strong><span>手机竖屏阅读：文字清晰不模糊，图片不错位，按钮可点击</span></li>
        <li><strong>电脑端适配</strong><span>电脑横屏阅读：版面正常，翻页效果正常</span></li>
      </ol>
    </div>
  </div>
);

const reviewNotes = (
  <div className="cell-section-notes">
    <p><b>数据验证：</b><span>根据阅读时长最久的页面瞄准下期优化方向</span></p>
    <p><b>参考借鉴：</b><span>根据往期主题纵向对比策划新一期内容</span></p>
  </div>
);

const publishingRows: ReactNode[][] = [
  ["预览适配", "手机/电脑/平板多端预览，检查显示效果", previewChecklist],
  ["发布上线", "在平台发布，生成永久链接和二维码", "分享标题/封面/描述正确，品牌Logo已设置，访问权限正确（公开/密码）"],
  ["多渠道分发", "通过微信/飞书等渠道推送", "链接可嵌入推文"],
  ["数据监控", "跟踪阅读量、阅读时长、热门页面、分享渠道", "发布后第1天/第3天/第7天分别查看，及时二次推送"],
  ["复盘", "分析数据、汇总往期约稿主题", reviewNotes],
];

const interactionRows = [
  ["嵌入视频", "人物采访、活动回顾、产品演示、教程讲解", "相关文章页旁，或专题栏目首页", "视频时长建议≤1分钟，文件不要过大，需有封面图"],
  ["嵌入音频", "刊首语（主编语音）、音乐背景、访谈录音", "刊首语页、文章页底部", "音频默认不自动播放，避免惊吓读者；提供播放控件"],
  ["超链接", "广告页导流、报名入口、延伸阅读、相关文章跳转", "广告页、目录、文章末尾“了解更多”", "链接必须校验有效性，内部链接加阅读密码时注意权限"],
  ["弹窗/浮层", "重要通知、活动报名、问卷调查", "封面后第一页或文章关键页", "不要频繁弹窗，影响阅读体验；一期最多1-2个"],
  ["翻页动画", "整本刊物的翻页效果", "全局设置", "选择与刊物风格匹配的动画（简约刊用淡入，科技刊用滑动）"],
  ["部件动画", "标题/图片加载时的动效", "重点页面的标题和图片", "适度使用，避免所有元素都动导致杂乱"],
  ["电话/按钮", "联系我们、一键拨号、立即报名", "封底/广告页/活动页", "按钮位置醒目，文案明确（如“立即报名”“点击咨询”）"],
];

function GuideTable({ label, headers, rows, numbered = false, className }: { label: string; headers: string[]; rows: ReactNode[][]; numbered?: boolean; className?: string }) {
  return (
    <div className="guide-table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className={["guide-table", numbered && "guide-table--numbered", className].filter(Boolean).join(" ")}>
        <thead><tr>{numbered && <th aria-label="序号">NO.</th>}{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${label}-${rowIndex}`}>
              {numbered && <td className="guide-table__number">{String(rowIndex + 1).padStart(2, "0")}</td>}
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === 0 && typeof cell === "string" && cell ? <strong>{cell}</strong> : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

export default function EditorialMagazineGuidePage() {
  return (
    <main id="top">
      <a className="skip-link" href="#comparison">跳到指南内容</a>
      <header className="hero">
        <div className="guide-site-header">
          <Link className="guide-wordmark" href="/" aria-label="返回 Yancy's Lab 首页"><span>Yancy&apos;s Lab</span><small>Editorial Studio</small></Link>
          <Link className="guide-return" href="/tools">返回工具清单 <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero__layout">
          <div className="hero__content">
            <h1>电子刊制作指南</h1>
            <p>工具怎么选、流程怎么走、互动怎么做。</p>
            <a className="hero__start" href="#comparison">阅读指南 <span aria-hidden="true">↓</span></a>
          </div>
          <aside className="hero-index" aria-label="电子刊制作指南目录">
            <ol>
              <li><a href="#comparison"><span>01</span>电子刊优势</a></li>
              <li><a href="#tools-selection"><span>02</span>工具选型</a></li>
              <li><a href="#workflow"><span>03</span>制作流程</a></li>
              <li><a href="#interaction"><span>04</span>互动元素</a></li>
            </ol>
          </aside>
        </div>
      </header>

      <nav className="quick-nav" aria-label="指南目录">
        <a href="#comparison"><span>01</span><b>电子刊优势</b><small>ADVANTAGES</small></a>
        <a href="#tools-selection"><span>02</span><b>工具选型</b><small>TOOLS</small></a>
        <a href="#workflow"><span>03</span><b>制作流程</b><small>WORKFLOW</small></a>
        <a href="#interaction"><span>04</span><b>互动元素</b><small>INTERACTION</small></a>
      </nav>

      <section className="section" id="comparison">
        <div className="section-heading section-heading--split"><div><p className="section-kicker">01 · ADVANTAGES</p><h2>电子刊优势</h2></div><p>从制作成本到环保属性，逐项查看电子刊优势。</p></div>
        <GuideTable label="电子刊优势" headers={["维度", "电子刊优势"]} rows={comparisonRows} numbered />
        <SectionPager current="01" next="#tools-selection" />
      </section>

      <section className="section section--tinted" id="tools-selection">
        <div className="section-heading section-heading--split"><div><p className="section-kicker">02 · TOOL SELECTION</p><h2>工具选型</h2></div><p>工具分类总览与选型决策。</p></div>
        <div className="content-block"><div className="content-block__label"><span>2.1</span><h3>工具分类总览</h3></div><GuideTable label="工具分类总览" headers={["类别", "代表工具", "适用人群", "上手难度", "核心优势"]} rows={toolOverviewRows} numbered /></div>
        <div className="content-block"><div className="content-block__label"><span>2.2</span><h3>选型决策</h3></div><GuideTable label="电子刊工具选型决策" headers={["需求", "首选工具", "理由"]} rows={decisionRows} numbered /></div>
        <SectionPager current="02" next="#workflow" />
      </section>

      <section className="section" id="workflow">
        <div className="section-heading section-heading--split"><div><p className="section-kicker">03 · WORKFLOW</p><h2>制作流程</h2></div><p>策划准备 / 编辑制作 / 发布校对</p></div>
        <div className="stage-list">
          <article className="stage"><header><span>STAGE 01</span><h3>策划准备</h3></header><GuideTable label="阶段一策划准备" headers={["节点", "特别注意"]} rows={planningRows} numbered /></article>
          <article className="stage"><header><span>STAGE 02</span><h3>编辑制作</h3></header><GuideTable label="阶段二编辑制作" headers={["节点", "特别注意"]} rows={editingRows} numbered /></article>
          <article className="stage"><header><span>STAGE 03</span><h3>发布校对</h3></header><GuideTable label="阶段三发布校对" headers={["节点", "做什么", "特别注意"]} rows={publishingRows} numbered className="publishing-table" /></article>
        </div>
        <SectionPager current="03" next="#interaction" />
      </section>

      <section className="section section--tinted" id="interaction">
        <div className="section-heading section-heading--split"><div><p className="section-kicker">04 · INTERACTION</p><h2>互动元素</h2></div><p>合理使用互动元素可显著提升阅读时长和参与感。</p></div>
        <GuideTable label="电子刊互动元素" headers={["互动类型", "适用场景", "放置位置建议", "注意事项"]} rows={interactionRows} numbered />
        <SectionPager current="04" />
      </section>

      <footer><p>电子刊制作指南</p><a href="#top">返回顶部 ↑</a></footer>
    </main>
  );
}
