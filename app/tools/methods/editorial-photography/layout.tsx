import "./photography.css";

export default function PhotographyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="photography-guide-page">
      {children}
    </div>
  );
}
