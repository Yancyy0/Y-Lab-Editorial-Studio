"use client";

import { useMemo, useState } from "react";
import ModuleHeader from "../ModuleHeader";

const categories = ["全部", "海报制作", "图片素材", "文件处理", "排版设计", "其他"] as const;

type ToolCategory = (typeof categories)[number];

type ToolItem = {
  name: string;
  url: string;
  description: string;
  category: Exclude<ToolCategory, "全部">;
  action: string;
};

const tools: ToolItem[] = [
  { name: "稿定设计", url: "https://www.gaoding.com", description: "使用在线模板和AI设计能力制作海报、封面、邀请函及宣传图片", category: "海报制作", action: "模板设计" },
  { name: "创客贴", url: "https://www.chuangkit.com", description: "制作海报、公众号封面、PPT和印刷宣传物料", category: "海报制作", action: "模板设计" },
  { name: "可画", url: "https://www.canva.cn", description: "快速制作配图、海报及活动物料", category: "海报制作", action: "模板设计" },
  { name: "LiblibAI", url: "https://www.liblib.art", description: "调用多种图片与视频模型生成或编辑视觉素材", category: "海报制作", action: "AI生成" },
  { name: "即梦AI", url: "https://jimeng.jianying.com", description: "通过文字或参考图生成并编辑图片、视频", category: "海报制作", action: "AI生成" },
  { name: "字由", url: "https://www.hellofont.cn", description: "检索、预览和管理字体并在常用设计软件中快速切换使用", category: "海报制作", action: "字体素材" },
  { name: "100font", url: "https://www.100font.com", description: "按语言、风格和授权类型查找免费商用字体及用字安全资料", category: "海报制作", action: "字体检索" },
  { name: "Pexels", url: "https://www.pexels.com/zh-cn", description: "搜索并下载免费的摄影图片与视频", category: "图片素材", action: "免商素材" },
  { name: "Unsplash", url: "https://unsplash.com", description: "搜索并下载高质量摄影图片与插画", category: "图片素材", action: "免商素材" },
  { name: "DWPNG", url: "https://dwpng.com", description: "查找并下载透明背景PNG元素", category: "图片素材", action: "PNG素材" },
  { name: "佐糖（PicWish）", url: "https://picwish.cn", description: "在线完成抠图、裁剪、换背景、去水印、清晰化等常用图片处理", category: "文件处理", action: "图片处理" },
  { name: "iLoveIMG", url: "https://www.iloveimg.com/zh-cn", description: "在线压缩、裁剪、调整尺寸、转换和编辑图片", category: "文件处理", action: "图片处理" },
  { name: "docsmall", url: "https://docsmall.com", description: "批量压缩、裁剪和转换图片并处理GIF与PDF等常用文件", category: "文件处理", action: "图片处理" },
  { name: "Ezgif", url: "https://ezgif.com", description: "在线制作、裁剪、压缩和转换GIF及短视频动图", category: "文件处理", action: "图片处理" },
  { name: "iLovePDF", url: "https://www.ilovepdf.com", description: "在线合并、拆分、压缩、转换和整理PDF", category: "文件处理", action: "PDF处理" },
  { name: "FreeCompress", url: "https://freecompress.com", description: "在线压缩图片、视频、音频和PDF等文件", category: "文件处理", action: "文件压缩" },
  { name: "中国色", url: "https://zhongguose.com", description: "查询中国传统色名称、色值与配色灵感", category: "排版设计", action: "配色灵感" },
  { name: "Tosea.ai", url: "https://tosea.ai", description: "将文档提炼为结构清晰、可继续编辑的PPT", category: "排版设计", action: "AI生成PPT" },
  { name: "爱给网", url: "https://www.aigei.com", description: "查找音效、配乐、视频、设计模板和图片等多媒体创作素材", category: "其他", action: "音视频素材" },
  { name: "草料二维码", url: "https://cli.im", description: "将网址、图文、文件、音视频或报名表生成二维码", category: "其他", action: "二维码生成" },
  { name: "镝数图表", url: "https://dycharts.com", description: "无需编程制作静态、动态和交互式图表", category: "其他", action: "图表制作" },
  { name: "笔杆儿网（笔杆子家园）", url: "https://www.biganzijiayuan.com", description: "检索公文范文、写作素材和技法文章", category: "其他", action: "写作采编" },
  { name: "XMind", url: "https://xmind.cn", description: "在线创建和整理思维导图", category: "其他", action: "思维导图" },
  { name: "幕布", url: "https://mubu.com", description: "用大纲方式整理稿件与项目思路", category: "其他", action: "思维导图" },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("全部");
  const visibleTools = useMemo(
    () => activeCategory === "全部" ? tools : tools.filter((tool) => tool.category === activeCategory),
    [activeCategory],
  );

  return (
    <main className="annual-page tools-page">
      <ModuleHeader activeSection="tools" />

      <section className="tools-hero" aria-labelledby="tools-title">
        <h1 id="tools-title" className="tools-title">
          <span>工具清单</span>
          <span>TOOLS DIRECTORY</span>
        </h1>
      </section>

      <section className="tools-directory" aria-label="宣传工具目录">
        <nav className="tools-filters" aria-label="工具分类筛选">
          {categories.map((category) => (
            <button
              type="button"
              className={activeCategory === category ? "is-active" : undefined}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="tools-grid">
          {visibleTools.map((tool) => (
            <a
              className="tool-card"
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${tool.name}，打开外部网站`}
              key={tool.name}
            >
              <h2 className="tool-card__title">{tool.name}</h2>
              <p className="tool-card__description">{tool.description}</p>
              <span className="tool-card__action">{tool.action}</span>
              <span className="tool-card__arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
