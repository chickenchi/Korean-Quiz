"use client";

import { openViewState } from "@/app/atom/quizAtom";
import { Close } from "@/public/svgs/ListSVG";
import { useAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";
import { getTrackBackground, Range } from "react-range";

export default function QuizView({
  article,
  image,
}: {
  article?: string;
  image?: any;
}) {
  const [openView, setOpenView] = useAtom(openViewState);
  const [opacity, setOpacity] = useState([80]);
  const [fontSize, setFontSize] = useState(15);
  const [imageSize, setImageSize] = useState(90);

  const STEP_OPACITY = 0.1;
  const MIN_OPACITY = 20;
  const MAX_OPACITY = 100;

  const changeFontSize = (type: "+" | "-") => {
    const MIN_FONT_SIZE = 10;
    const MAX_FONT_SIZE = 40;
    const delta = type === "+" ? 2 : -2;
    const newSize = fontSize + delta;
    if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE)
      setFontSize(newSize);
  };

  const changeImageSize = (type: "+" | "-") => {
    const MIN_IMAGE_SIZE = 50;
    const MAX_IMAGE_SIZE = 90;
    const delta = type === "+" ? 10 : -10;
    const newSize = imageSize + delta;
    if (newSize >= MIN_IMAGE_SIZE && newSize <= MAX_IMAGE_SIZE)
      setImageSize(newSize);
  };

  if (!openView || (!image && !article)) return null;

  return (
    /* OverlayView: 배경 */
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[100] bg-black/10">
      {/* ViewContent: 메인 팝업창 */}
      <div
        style={{ opacity: `${opacity[0]}%` }}
        className="w-[90%] h-[45%] bg-white shadow-[3px_3px_10px_0px_#d6d6d6] flex flex-col items-end overflow-hidden rounded-lg"
      >
        {/* ViewHeader */}
        <header className="w-full h-[15%] flex items-center justify-end">
          <button
            onClick={() => setOpenView(false)}
            className="w-[50px] h-[50px] flex items-center justify-center bg-transparent border-none text-black active:opacity-50"
          >
            <Close />
          </button>
        </header>

        {/* ViewSection: 본문 영역 */}
        <section className="w-full h-[70%] pt-[5%] flex justify-center overflow-hidden">
          {article ? (
            <div
              style={{ fontSize: `${fontSize}pt` }}
              className="w-full h-[95%] px-5 whitespace-pre-wrap overflow-y-auto scrollbar-hide font-normal"
            >
              {article}
            </div>
          ) : (
            <div
              style={{ width: `${imageSize}%` }}
              className="relative h-full transition-all duration-200"
            >
              <Image src={image} alt="사진" fill className="object-contain" />
            </div>
          )}
        </section>

        {/* ViewFooter: 하단 도구 모음 */}
        <footer className="relative w-full h-[15%] flex items-center px-5 justify-between">
          {/* SliderContainer: 투명도 조절 */}
          <div className="flex items-center">
            <Range
              values={opacity}
              step={STEP_OPACITY}
              min={MIN_OPACITY}
              max={MAX_OPACITY}
              onChange={(values) => setOpacity(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100px",
                    background: getTrackBackground({
                      values: opacity,
                      colors: ["#E04E92", "#ccc"],
                      min: MIN_OPACITY,
                      max: MAX_OPACITY,
                    }),
                  }}
                  className="rounded-full"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{ ...props.style }}
                  className="h-5 w-5 bg-white rounded-full shadow-[0px_1px_5px_#AAA] outline-none border-none"
                />
              )}
            />
          </div>

          {/* SizeButtonContainer: 크기 조절 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={() =>
                article ? changeFontSize("+") : changeImageSize("+")
              }
              className="px-3 py-1 text-[17pt] font-normal text-black bg-transparent active:bg-gray-100 rounded select-none"
            >
              +
            </button>
            <button
              onClick={() =>
                article ? changeFontSize("-") : changeImageSize("-")
              }
              className="px-3 py-1 text-[17pt] font-normal text-black bg-transparent active:bg-gray-100 rounded select-none"
            >
              -
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
