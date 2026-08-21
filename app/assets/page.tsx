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
    category: "SAB品牌素材",
    items: [
      { name: "SAB LOGO", href: "https://weixing.feishu.cn/drive/folder/TyNrfYWuKlVbMidCLUlcdYchnrg" },
      { name: "产业PPT模版", href: "https://weixing.feishu.cn/drive/folder/AGexfXQAOltqfKd2lGicC6GEnwf" },
      { name: "其他", href: "https://weixing.feishu.cn/drive/folder/D0sifppG0lmsRadTN4hcgtSBn3g" },
    ],
  },
  {
    code: "CASES",
    category: "活动案例库",
    items: [
      { name: "企业文化", href: "https://weixing.feishu.cn/wiki/B7u7wImmliXeEBkEd5Vce3HWn4b?from=from_copylink" },
      { name: "节日活动", href: "https://weixing.feishu.cn/wiki/CtVvw2aqmiONgQkDcgLc528wnNh?from=from_copylink" },
    ],
  },
  {
    code: "PHOTO",
    category: "品牌图库",
    items: [
      { name: "产业新办公楼", href: "https://weixing.feishu.cn/drive/folder/OyRQfseVolGkvad9niccUAzRnLb" },
      { name: "人物拍摄范例", href: "https://weixing.feishu.cn/drive/folder/WBVIfDQAslrTWcdoYkTcByeknDe" },
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
