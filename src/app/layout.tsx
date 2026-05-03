import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "スタンプ帳 🌸",
  description: "毎日の達成をかわいくスタンプ！",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-round bg-stamp-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
