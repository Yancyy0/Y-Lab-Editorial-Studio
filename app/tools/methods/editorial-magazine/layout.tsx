import "./magazine.css";

export default function EditorialMagazineGuideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="editorial-magazine-guide-page">{children}</div>;
}
