import type { Metadata } from "next";
import "./globals.css";
import ConfirmModal from "./components/confirm_modal/ConfirmModal";
import InfoModal from "./components/info_modal/InfoModal";
import localFont from "next/font/local";
import InputModal from "./components/input_modal/InputModal";
import LoginModal from "./components/login_modal/LoginModal";
import AuthProvider from "./components/auth_provider/AuthProvider";

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
        <AuthProvider>
          <ConfirmModal />
          <InfoModal />
          <InputModal />
          <LoginModal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
