import { infoConfigState } from "@/app/atom/quizAtom";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";

const AnswerValue = styled.p<{ $clickable: boolean }>`
  font-size: 14pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EllipsisText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);
  const [, setInfoConfig] = useAtom(infoConfigState);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
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
    <AnswerValue ref={ref} $clickable={isEllipsis} onClick={handleClick}>
      {text}
    </AnswerValue>
  );
};
