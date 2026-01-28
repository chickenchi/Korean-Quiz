"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { Close } from "@/public/svgs/ListSVG";
import { confirmConfigState } from "@/app/atom/modalAtom";

export default function ConfirmModal() {
  const [confirmModalProps, setConfirmModalProps] = useAtom(confirmConfigState);

  if (!confirmModalProps) return null;

  const isDanger = confirmModalProps.type === "danger";

  // 버튼 공통 스타일 변수
  const baseBtn =
    "px-5 py-[11px] rounded-[5px] text-[16px] font-normal transition-colors outline-none";
  const grayBtn = `${baseBtn} bg-transparent border border-[#333] text-[#333] active:bg-gray-100`;
  const pinkBtn = `${baseBtn} bg-[#d52e7c] text-white border-none active:opacity-90`;

  return (
    /* ModalOverlay */
    <div
      className="absolute inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[999]"
      onClick={() => setConfirmModalProps(null)}
    >
      {/* ModalContent */}
      <div
        className="relative w-[80%] bg-white rounded-[10px] p-5 shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ModalCloseButton */}
        <button
          onClick={() => setConfirmModalProps(null)}
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

        {/* ContentText */}
        <p className="mt-[30px] px-5 text-[#333] text-[20px] text-center whitespace-pre-wrap font-normal leading-snug">
          {confirmModalProps.content}
        </p>

        {/* ButtonContainer: 위험 상태(isDanger)에 따라 버튼 순서나 색상 가독성 조절 */}
        <div className="mt-[30px] mr-[10px] flex justify-end gap-[10px]">
          <button
            onClick={() => confirmModalProps.onCancel()}
            className={isDanger ? pinkBtn : grayBtn}
          >
            취소
          </button>
          <button
            onClick={() => confirmModalProps.onConfirm()}
            className={isDanger ? grayBtn : pinkBtn}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
