"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { Close } from "@/public/svgs/ListSVG";
import { infoConfigState } from "@/app/atom/modalAtom";

export default function InfoModal() {
  const [infoModalProps] = useAtom(infoConfigState);

  if (!infoModalProps) return null;

  return (
    /* ModalOverlay: fixed로 화면 전체 고정 및 클릭 시 닫기 */
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[999] pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        infoModalProps.onClose();
      }}
    >
      {/* ModalContent */}
      <div
        className="relative w-[80%] bg-white rounded-[10px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ModalCloseButton */}
        <button
          onClick={() => infoModalProps.onClose()}
          className="absolute top-3 right-[10px] w-[50px] h-[50px] flex justify-center items-center bg-transparent border-none text-black active:opacity-50"
        >
          <Close />
        </button>

        {/* LogoContainer */}
        <div className="mt-[5px] ml-[5px]">
          <Image
            src="/images/logo/Logo.png"
            alt="평명"
            width={67}
            height={27}
            className="object-contain"
            priority
          />
        </div>

        {/* ContentText: 긴 텍스트 대응을 위해 break-words 추가 */}
        <p className="mt-[30px] mx-5 text-[#333] text-[20px] text-center whitespace-pre-wrap break-words font-normal leading-snug">
          {infoModalProps.content}
        </p>

        {/* ButtonContainer */}
        <div className="mt-[30px] mr-[10px] flex justify-end">
          <button
            onClick={() => infoModalProps.onClose()}
            className="px-5 py-[11px] border border-[#333] rounded-[5px] text-[16px] font-normal bg-transparent active:bg-gray-100 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
