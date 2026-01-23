import type { Metadata } from "next";
import "./globals.css";
import ConfirmModal from "./components/ConfirmModal";
import InfoModal from "./components/InfoModal";
import localFont from "next/font/local";

const cafe24OnePrettyNight = localFont({
  src: [
    {
      path: "./fonts/Cafe24Oneprettynight/Cafe24Oneprettynight.ttf",
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
      <body>
        <ConfirmModal />
        <InfoModal />
        {children}
      </body>
    </html>
  );
}
