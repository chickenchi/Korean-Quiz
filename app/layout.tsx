import type { Metadata } from "next";
import "./globals.css";
import ConfirmModal from "./components/common/modal/confirm_modal/ConfirmModal";
import InfoModal from "./components/common/modal/info_modal/InfoModal";
import localFont from "next/font/local";
import InputModal from "./components/common/modal/input_modal/InputModal";
import LoginModal from "./components/common/modal/login_modal/LoginModal";
import AuthProvider from "./components/common/auth_provider/AuthProvider";

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
