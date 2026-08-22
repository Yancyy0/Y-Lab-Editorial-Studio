import "./copyright.css";

export default function CopyrightCheckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="copyright-risk-page">{children}</div>;
}
