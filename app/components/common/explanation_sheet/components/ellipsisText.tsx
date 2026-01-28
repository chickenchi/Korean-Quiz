"use client";

import { infoConfigState } from "@/app/atom/modalAtom";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

export const EllipsisText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);
  const [, setInfoConfig] = useAtom(infoConfigState);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    // 텍스트가 컨테이너보다 길면 말줄임표가 생겼다고 판단
    setIsEllipsis(el.scrollWidth > el.clientWidth);
  }, [text]);

  const handleClick = () => {
    if (!isEllipsis) return;

    setInfoConfig({
      content: text,
      onClose: () => {
        setInfoConfig(null);
      },
    });
  };

  return (
    <p
      ref={ref}
      onClick={handleClick}
      className={`text-[14pt] whitespace-nowrap overflow-hidden text-ellipsis font-normal
        ${isEllipsis ? "cursor-pointer" : "cursor-default"}
      `}
    >
      {text}
    </p>
  );
};
