import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const title = "Transformer 一图懂｜从 Token 到注意力";
  const description = "面向初学者的交互式 Transformer 概念地图：Token、注意力、多头注意力、全连接层与训练验证测试集。";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title,
    description,
    openGraph: { title, description, images: [{ url: "/og.png", width: 1664, height: 936, alt: "Transformer 一图懂" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
