"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";
import { loginConfigState } from "@/app/atom/modalAtom";
import { GoogleLogo } from "@/public/svgs/SigninSVG";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/app/lib/client";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const [loginModalProps, setLoginModalProps] = useAtom(loginConfigState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔥 users/{uid} 레퍼런스
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // 2. 최초 로그인: 문서 새로 생성 (setDoc)
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // 3. 재로그인: 마지막 로그인 시간만 업데이트 (updateDoc)
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
      }

      setLoginModalProps(null);
    } catch (err) {
      console.error("구글 로그인 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!loginModalProps) return null;

  const buttonStyle =
    "px-5 py-2 mb-2 border border-[#333] rounded-[5px] text-[16px] font-normal bg-transparent active:bg-gray-100 transition-colors";

  return (
    /* ModalOverlay: fixed로 화면 전체 고정 및 클릭 시 닫기 */
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[999] pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        loginModalProps.onClose();
      }}
    >
      {/* ModalContent */}
      <div
        className="relative w-[80%] bg-white rounded-[10px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LogoContainer */}
        <div className="mt-[5px] ml-[5px] flex justify-center">
          <Image
            src="/images/logo/Logo.png"
            alt="평명"
            width={67}
            height={27}
            className="object-contain"
            priority
          />
        </div>

        {/* ButtonContainer */}
        <div className="mt-5 mr-[10px] flex flex-col justify-center">
          <button
            onClick={() => alert("추후 도입 예정입니다.")}
            className={buttonStyle}
          >
            Sign in Clearity Account
          </button>
          <button
            onClick={handleGoogleLogin}
            className={`${buttonStyle} flex items-center justify-center`}
          >
            <GoogleLogo />
            <p className="ml-2">Sign in with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
}
