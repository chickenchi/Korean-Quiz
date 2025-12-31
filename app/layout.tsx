import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const cafe24OnePrettyNight = localFont({
  src: [
    {
      path: "../public/fonts/Cafe24OnePrettyNight/Cafe24OnePrettyNight.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "한국어 퀴즈",
  description: "사용자에게 맞는 퀴즈 제공",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cafe24OnePrettyNight.className}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
