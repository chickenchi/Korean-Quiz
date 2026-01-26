"use client";

import { openViewState, questionState } from "@/app/atom/quizAtom";
import { Close } from "@/public/svgs/ListSVG";
import { useAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";
import { getTrackBackground, Range } from "react-range";
import styled from "styled-components";

const OverlayView = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  z-index: 1;
`;

const ViewContent = styled.div<{ $opacity: number }>`
  background-color: white;
  opacity: ${({ $opacity }) => `${$opacity}%`};

  width: 90%;
  height: 45%;

  box-shadow: 3px 3px 10px 0px #d6d6d6;

  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

const ViewHeader = styled.header`
  width: 100%;
  height: 15%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background-color: transparent;

  width: 50px;
  height: 50px;

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;

  color: black;
`;

const ViewSection = styled.section`
  width: 100%;
  height: 70%;

  padding-top: 5%;

  display: flex;
  justify-content: center;
`;

const ViewFooter = styled.footer`
  position: relative;

  width: 100%;
  height: 15%;
`;

const SliderContainer = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translate(0%, -50%);
`;

const SizeButtonContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translate(0%, -50%);
`;

const SizeButton = styled.button`
  background-color: transparent;

  padding: 0 10px;

  border: none;
  border-radius: 3px;

  font-size: 17pt;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  color: black;
`;

const ImageContainer = styled.div<{ $imageSize: number }>`
  position: relative;
  width: ${({ $imageSize }) => `${$imageSize}%`};
  height: 100%;
`;

const Article = styled.div<{ $fontSize: number }>`
  width: 100%;
  height: 95%;

  padding: 0 20px;

  font-size: ${({ $fontSize }) => `${$fontSize}pt`};

  overflow-y: auto;

  white-space: break-spaces;

  -ms-overflow-style: none;
  scrollbar-width: none;

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

export default function QuizView({
  article,
  image,
}: {
  article?: string;
  image?: any;
}) {
  const [openView, setOpenView] = useAtom(openViewState);

  const [opacity, setOpacity] = useState([80]);

  const STEP_OPACITY = 0.1;
  const MIN_OPACITY = 20;
  const MAX_OPACITY = 100;

  const [fontSize, setFontSize] = useState(15);

  const changeFontSize = (type: "+" | "-") => {
    const MIN_FONT_SIZE = 10;
    const MAX_FONT_SIZE = 40;

    const delta = type === "+" ? 2 : -2;
    const newSize = fontSize + delta;

    if (newSize < MIN_FONT_SIZE || newSize > MAX_FONT_SIZE) return;
    setFontSize(newSize);
  };

  const [imageSize, setImageSize] = useState(90);

  const changeImageSize = (type: "+" | "-") => {
    const MIN_IMAGE_SIZE = 50;
    const MAX_IMAGE_SIZE = 90;

    const delta = type === "+" ? 10 : -10;
    const newSize = imageSize + delta;

    if (newSize < MIN_IMAGE_SIZE || newSize > MAX_IMAGE_SIZE) return;

    setImageSize(newSize);
  };

  if (!openView || (!image && !article)) return false;

  return (
    <OverlayView>
      <ViewContent $opacity={opacity[0]}>
        <ViewHeader>
          <CloseButton onClick={() => setOpenView(false)}>
            <Close />
          </CloseButton>
        </ViewHeader>
        <ViewSection>
          {article ? (
            <Article $fontSize={fontSize}>{article}</Article>
          ) : (
            <ImageContainer $imageSize={imageSize}>
              <Image
                src={image}
                alt="사진"
                fill
                style={{ objectFit: "contain" }}
              />
            </ImageContainer>
          )}
        </ViewSection>
        <ViewFooter>
          <SliderContainer>
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
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "20px",
                    width: "20px",
                    backgroundColor: "#FFF",
                    borderRadius: "100px",
                    boxShadow: "0px 1px 5px #AAA",
                    outline: "none",
                  }}
                />
              )}
            />
          </SliderContainer>
          <SizeButtonContainer>
            <SizeButton
              onClick={() =>
                article ? changeFontSize("+") : changeImageSize("+")
              }
            >
              +
            </SizeButton>
            <SizeButton
              onClick={() =>
                article ? changeFontSize("-") : changeImageSize("-")
              }
            >
              -
            </SizeButton>
          </SizeButtonContainer>
        </ViewFooter>
      </ViewContent>
    </OverlayView>
  );
}
