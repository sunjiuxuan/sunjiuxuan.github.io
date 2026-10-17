import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./adventure.css";
export const metadata: Metadata = {
  title: { default: "桃源境 · 一处数字小院", template: "%s · 桃源境" },
  description: "在山水间，安放日常。一个可以漫游的个人数字花园。",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f1e8",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
