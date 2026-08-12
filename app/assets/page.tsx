import ModuleHeader from "../ModuleHeader";

type AssetItem = {
  name: string;
  href: string;
};

type AssetGroup = {
  code: string;
  category: string;
  items: AssetItem[];
};

const assetGroups: AssetGroup[] = [
  {
    code: "SAB",
    category: "SAB 品牌素材",
    items: [
      { name: "SAB LOGO", href: "https://hcnwz7yz594b.feishu.cn/drive/folder/TyNrfYWuKlVbMidCLUlcdYchnrg" },
      { name: "其他", href: "https://hcnwz7yz594b.feishu.cn/drive/folder/D0sifppG0lmsRadTN4hcgtSBn3g" },
    ],
  },
  {
    code: "PPT",
    category: "PPT 模版",
    items: [
      { name: "产业 PPT 模版", href: "https://hcnwz7yz594b.feishu.cn/file/Ul5UbrxmKoUABax32VMcXmGtngh" },
      { name: "免商字体 ｜ 思源", href: "https://hcnwz7yz594b.feishu.cn/drive/folder/EwJFfv2OClENSVdRsbgcL4oOnDb" },
    ],
  },
  {
    code: "VIDEO",
    category: "星视频封面模版",
    items: [
      { name: "叙事类封面模版", href: "https://hcnwz7yz594b.feishu.cn/slides/LvuHsUUxpl8BLAd6rfYcrcq7n9h" },
      { name: "新闻类封面模版", href: "https://hcnwz7yz594b.feishu.cn/slides/Mwo9sEh7OlikRkdtiwxcRkFhnrh" },
    ],
  },
];

export default function AssetsPage() {
  return (
    <main className="annual-page assets-page">
      <ModuleHeader activeSection="assets" />

      <section className="assets-hero" aria-labelledby="assets-title">
        <h1 id="assets-title" className="assets-title">
          <span>物料素材</span>
          <span>BRAND ASSETS</span>
        </h1>
      </section>

      <section className="assets-downloads" aria-label="品牌素材下载">
        <div className="assets-rail" aria-hidden="true" />

        <div className="assets-lanyards">
          {assetGroups.map((group, groupIndex) => (
            <article className="asset-lanyard" key={group.category}>
              <div className="asset-strap" aria-hidden="true">
                <span />
              </div>

              <div className="asset-pass">
                <span className="asset-pass__clip" aria-hidden="true" />
                <span className="asset-pass__number">0{groupIndex + 1}</span>
                <span className="asset-pass__code" aria-hidden="true">{group.code}</span>
                <h2>{group.category}</h2>

                <div className="asset-pass__list">
                  {group.items.map((item) => (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`前往飞书获取${item.name}`}
                      key={item.name}
                    >
                      <span>{item.name}</span>
                      <span className="asset-download-icon" aria-hidden="true">↓</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
