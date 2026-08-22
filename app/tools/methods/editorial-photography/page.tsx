import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CompositionAccordion, MeetingEditorial } from "./PhotographyInteractive";

export const metadata: Metadata = {
  title: "宣传摄影指南",
  description: "面向企业宣传现场的摄影参数、构图与常见场景指南。",
};

const feishuChatUrl =
  "https://applink.feishu.cn/client/chat/open?openId=ou_4afe58eadaf938b6270a581187d3ad81";

const compositionExamples = [
  { src: "/photography/image32.jpeg", label: "居中（中心）构图" },
  { src: "/photography/image33.jpeg", label: "对称构图" },
  { src: "/photography/image34.jpeg", label: "三分法构图" },
  { src: "/photography/t-composition.jpeg", label: "T型构图" },
  { src: "/photography/diagonal-composition.jpeg", label: "对角线构图" },
  { src: "/photography/image37.jpg", label: "前景构图" },
];

const meetingCards = [
  {
    code: "01",
    title: "会议全景",
    image: "/photography/image42.jpeg",
    points: [
      "前景：取景宏观，中心对称；背景带会议名称，并记录职务最高领导发言。",
      "后景：可俯拍体现规模；避开喝茶、交流、坐姿不正等状态，抓拍时不打扰会议。",
      "相机拍摄时，快门保留在 100 以内，避免 LED 屏字迹不清。",
    ],
  },
  {
    code: "02",
    title: "研讨 / 培训交流",
    image: "/photography/image44.jpeg",
    points: [
      "拍到人物膝盖以上，画面生动饱满；根据会场实际避开背景杂物。",
      "抓取交流氛围较好的场景。",
      "战略研讨会抓取当组职务最高领导在场交流的照片。",
    ],
  },
  {
    code: "03",
    title: "发言近景",
    image: "/photography/image47.jpeg",
    points: [
      "一般采用中心构图；人物抬头面向观众时抓拍。",
      "避免低头、闭眼、看手机；背景尽量简洁。",
      "大胆走到人物面前，必要时停顿 2–3 秒，待其抬头后按下快门。",
    ],
  },
  {
    code: "04",
    title: "会议合影",
    image: "/photography/image49.jpeg",
    points: [
      "一般采用中心构图；注意领导站位或座位顺序。",
      "引导大家调整表情，确保无人闭眼；可拍摄 2 次。",
      "提前列出站位顺序；合影位置只需给第一排贴编号。",
    ],
  },
];

const factoryCards = [
  {
    code: "01",
    title: "会议室交流 · 3 张",
    image: "/photography/image51.jpeg",
    points: ["全景：中心对称，带会议名称或客户 Logo。", "侧拍：记录全员状态饱满的场景。", "特写：记录客户 1 号领导发言。"],
  },
  {
    code: "02",
    title: "参观车间",
    image: "/photography/image54.jpeg",
    points: ["常规选 2–3 个典型场景；特殊要求再全程跟拍。", "提前熟悉路线，结合近景、中景、全景。", "1 号人物居中正面拍摄；侧面至少看清面部，不拍后脑勺或背面。"],
  },
  {
    code: "03",
    title: "高层互动",
    image: "/photography/image60.jpeg",
    points: ["多拍双方协作、热情交谈、欣赏自然等互动镜头。", "摄影师注意引导、创造机会。", "条件允许时，给每位客户或业务伙伴拍单人特写。"],
  },
  {
    code: "04",
    title: "人与自然",
    image: "/photography/image68.jpeg",
    points: ["全景：体现人与自然、团队与自然风光。", "中景：体现团队协作。", "近景：体现自然特征、人物神情或活动主题。"],
  },
  {
    code: "05",
    title: "工作花絮",
    image: "/photography/image76.jpeg",
    points: ["全景 / 中景：体现团队活力与风采。", "特写：体现劳动成果等。"],
  },
  {
    code: "06",
    title: "工厂营销合影",
    image: "/photography/image84.jpeg",
    points: ["与其他场合合影一致。", "视线与人物平齐，画面端正，人物在中心。", "可拍摄 2 次，并提供拍照 Pose。"],
  },
];

export default function Home() {
  return (
    <main id="top">
      <a className="skip-link" href="#basics">跳到速查内容</a>

      <header className="hero">
        <div className="guide-site-header">
          <Link className="guide-wordmark" href="/" aria-label="返回 Yancy's Lab 首页">
            <span>Yancy&apos;s Lab</span>
            <small>Editorial Studio</small>
          </Link>
          <Link className="guide-return" href="/tools">返回工具清单 <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero__layout">
          <div className="hero__content">
            <h1>宣传摄影指南</h1>
            <p>参数怎么定、画面怎么构、现场怎么拍。</p>
            <a className="hero__start" href="#basics">阅读指南 <span aria-hidden="true">↓</span></a>
          </div>

          <aside className="profile-card" aria-label="摄影经验整理者吴梦燕">
            <div className="profile-card__base" aria-hidden="true">
              <div className="profile-card__avatar-space" />
              <h2>吴梦燕</h2>
              <p className="profile-card__about">摄影实操经验整理自@<strong>伟星股份产业综合部文宣组首席摄影</strong>吴梦燕，长期深耕企业宣传影像，沉淀诸多实战拍摄心得。</p>
              <span className="profile-card__mark">PHOTOGRAPHY / PRACTICE</span>
            </div>

            <div className="profile-card__reveal">
              <a
                className="profile-card__avatar-link"
                href={feishuChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="点击与吴梦燕在飞书对话"
              >
                <Image
                  src="/wu-mengyan.jpeg"
                  alt="吴梦燕头像"
                  fill
                  priority
                  sizes="88px"
                />
                <span role="tooltip">点击对话</span>
              </a>
              <h2>吴梦燕</h2>
              <p className="profile-card__about">摄影实操经验整理自@<strong>伟星股份产业综合部文宣组首席摄影</strong>吴梦燕，长期深耕企业宣传影像，沉淀诸多实战拍摄心得。</p>
              <span className="profile-card__mark">PHOTOGRAPHY / PRACTICE</span>
            </div>
          </aside>
        </div>
      </header>

      <nav className="quick-nav" aria-label="手册目录">
        <a href="#basics"><span>01</span><b>参数基础</b><small>CAMERA BASICS</small></a>
        <a href="#composition"><span>02</span><b>构图方法</b><small>COMPOSITION</small></a>
        <a href="#meeting"><span>03</span><b>会议培训</b><small>MEETING / TRAINING</small></a>
        <a href="#factory"><span>04</span><b>工厂营销</b><small>FACTORY MARKETING</small></a>
      </nav>

      <section className="section section--basics" id="basics">
        <div className="section-heading">
          <p className="section-kicker">01 · CAMERA BASICS</p>
          <h2>参数基础</h2>
          <p>快门、光圈、感光度三者共同决定了照片画面的明暗与表现。</p>
        </div>

        <div className="basics-content">
          <div className="exposure-grid">
            <article><b>快门</b><p>速度越快，进光越少、照片越暗；速度越慢，进光越多、照片越亮。</p></article>
            <article><b>光圈</b><p>数值越小，进光越多、背景虚化越明显；数值越大，背景越清晰。</p></article>
            <article><b>感光度</b><p>数值越高，照片越亮、噪点也越多；数值越低，照片越暗。</p></article>
          </div>

          <div className="parameter-table" aria-label="常用参数速查">
            <div className="parameter-row parameter-row--head"><span>场景</span><span>快门</span><span>光圈</span><span>ISO</span></div>
            <div className="parameter-row"><strong>人物特写</strong><span>—</span><span>F4.0 上下</span><span>—</span></div>
            <div className="parameter-row"><strong>大场景 / 合照</strong><span>—</span><span>至少 F6.3</span><span>—</span></div>
            <div className="parameter-row"><strong>室内</strong><span>80 / 100<br /><small>暗场大场景最低 60</small></span><span>—</span><span>—</span></div>
            <div className="parameter-row"><strong>室外人物活动</strong><span>200 及以上</span><span>—</span><span>500 以内</span></div>
            <div className="parameter-row"><strong>小会议室</strong><span>—</span><span>—</span><span>2000 上下</span></div>
            <div className="parameter-row"><strong>大教室</strong><span>—</span><span>—</span><span>5000–6400</span></div>
          </div>

          <aside className="field-note">
            <b>参数不是固定答案</b>
            <p>室外快门视活动速度而定；光线过强时，也可提高快门速度平衡曝光。室外 ISO 视天气调整，晴天低一点，阴天高一点。</p>
          </aside>
        </div>
      </section>

      <section className="section section--composition" id="composition">
        <div className="section-heading section-heading--row">
          <div>
            <p className="section-kicker">02 · COMPOSITION</p>
            <h2>构图先看这<br />六种方法</h2>
          </div>
        </div>

        <CompositionAccordion items={compositionExamples} defaultIndex={1} />
      </section>

      <section className="section section--scenarios" id="meeting">
        <div className="section-heading section-heading--row">
          <div>
            <p className="section-kicker">03 · MEETING / TRAINING</p>
            <h2>会议培训<br />四张必拍</h2>
          </div>
          <p>全景、交流、发言、合影。<br />先保证信息完整，再抓人物状态。</p>
        </div>
        <MeetingEditorial items={meetingCards} />

        <details className="placement-note">
          <summary>
            <span className="placement-note__title">合影站位提示</span>
            <span className="placement-note__hint placement-note__hint--closed" aria-hidden="true">点击 + 查看</span>
            <span className="placement-note__hint placement-note__hint--open" aria-hidden="true">点击 − 收起</span>
            <span className="placement-note__toggle" aria-hidden="true" />
          </summary>
          <div>
            <p><b>自身单位 · 偶数位领导</b><span>5、3、1、2、4、6</span></p>
            <p><b>两家单位</b><span>3、2、1、1、2、3</span></p>
          </div>
        </details>
      </section>

      <section className="section section--factory" id="factory">
        <div className="section-heading section-heading--row">
          <div>
            <p className="section-kicker">04 · FACTORY MARKETING</p>
            <h2>工厂营销<br />按路线拍</h2>
          </div>
          <p>会议室交流 → 参观车间 → 户外活动 → 合影</p>
        </div>
        <MeetingEditorial
          items={factoryCards}
          sectionLabel="FACTORY MARKETING"
          navigationLabel="工厂营销拍摄类型"
        />
      </section>

      <footer>
        <p>宣传摄影指南</p>
        <a href="#top">返回顶部 ↑</a>
      </footer>
    </main>
  );
}
