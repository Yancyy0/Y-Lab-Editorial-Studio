import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yancy's Lab · 宣传工作台",
  description: "面向企业宣传工作的轻量个人工作台。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="preload"
          href="/models/premium_keyboard_skyblue_v4.glb"
          as="fetch"
          crossOrigin="anonymous"
          type="model/gltf-binary"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
