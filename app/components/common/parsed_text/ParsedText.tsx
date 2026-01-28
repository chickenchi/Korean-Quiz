import { parseTextStyle } from "../../../tools/parse_text_style";

interface ParsedTextProps {
  text: string;
  className?: string; // 전체적인 텍스트 컬러나 기본 폰트 크기 제어용
}

export const ParsedText = ({
  text,
  className = "text-black",
}: ParsedTextProps) => {
  const parts = parseTextStyle(text);

  return (
    <div className={`inline ${className}`}>
      {parts.map((part, index) => (
        <span
          key={index}
          className={`
            ${part.bold ? "font-bold" : "font-normal"}
            ${part.italic ? "italic" : ""}
            ${part.sub ? "text-[0.7em] relative top-[0.25em] ml-[1px]" : ""}
            ${part.sup ? "text-[0.7em] relative -top-[0.35em] ml-[1px]" : ""}
          `}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
};
