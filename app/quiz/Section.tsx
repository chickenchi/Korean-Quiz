"use client";

import { Bookmark, DisabledBookmark } from "@/public/svgs/ListSVG";
import { Draw, ToggleTag, Write } from "@/public/svgs/QuizSVG";
import { useState } from "react";
import styled from "styled-components";

const QuizSection = styled.div`
  width: 100%;
  height: 80%;

  padding-top: 10px;
`;

const QuizContent = styled.div`
  position: relative;

  margin-bottom: 10px;

  width: 100%;
  height: 7%;

  display: flex;
  align-items: center;
`;

const ButtonImage = styled.button`
  background-color: transparent;
  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const TagContainer = styled.div`
  position: absolute;
  left: 10px;

  height: 100%;

  display: flex;
  align-items: center;
`;
const TagButton = styled(ButtonImage)``;

const TagElementContainer = styled.div`
  margin-left: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tag = styled.div`
  width: auto;
  height: 28px;

  margin-right: 5px;
  padding: 0px 13px;

  border: 2px solid black;
  border-radius: 7px;

  color: black;
  font-size: 12pt;
  font-weight: 500;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArtContentContainer = styled.div`
  position: absolute;
  right: 18px;

  display: flex;
  align-items: center;
`;

const DrawButton = styled(ButtonImage)`
  margin-right: 4px;
`;
const WriteButton = styled(ButtonImage)`
  margin-right: 4px;
`;
const BookmarkButton = styled(ButtonImage)``;

const QuizContainer = styled.div`
  height: 93%;

  display: flex;
  flex-direction: column;
`;

const QuizTitleContainer = styled.div`
  margin-bottom: 20px;

  display: flex;
  align-items: center;
`;

const QuizTitleNumber = styled.h1`
  margin-left: 30px;

  font-size: 23pt;
  font-weight: 600;
`;
const QuizTitleContent = styled.h1`
  width: 65%;

  margin-left: 20px;

  font-size: 17pt;
  font-weight: 400;
`;

const OptionContainer = styled.div`
  margin-left: 30px;

  display: flex;
  flex-direction: column;
`;
const OptionContentContainer = styled.div`
  display: flex;

  margin-bottom: 20px;
`;
const OptionNumber = styled.div`
  margin-right: 5px;

  font-size: 15pt;
`;
const OptionDescription = styled.div`
  font-size: 15pt;
`;

export default function Section() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tagActive, setTagActive] = useState(false);
  const [quizType] = useState("select");

  return (
    <QuizSection>
      <QuizContent>
        <TagContainer>
          <TagButton onClick={() => setTagActive(!tagActive)}>
            <ToggleTag />
          </TagButton>
          {tagActive && (
            <TagElementContainer>
              <Tag>초급</Tag>
              <Tag>어휘</Tag>
            </TagElementContainer>
          )}
        </TagContainer>
        <ArtContentContainer>
          <DrawButton>
            <Draw />
          </DrawButton>
          <WriteButton>
            <Write />
          </WriteButton>
          <BookmarkButton onClick={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? <Bookmark /> : <DisabledBookmark />}
          </BookmarkButton>
        </ArtContentContainer>
      </QuizContent>

      <QuizContainer>
        <QuizTitleContainer>
          <QuizTitleNumber>01</QuizTitleNumber>
          <QuizTitleContent>
            어떤 일을 몹시 즐겨서 거기에 빠지다. 이를 의미하는 단어는?
          </QuizTitleContent>
        </QuizTitleContainer>

        {quizType == "select" && (
          <OptionContainer>
            <OptionContentContainer>
              <OptionNumber>①</OptionNumber>
              <OptionDescription>
                가는 말이 고와야 오는 말도 곱다.
              </OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer>
              <OptionNumber>②</OptionNumber>
              <OptionDescription>발 없는 말이 천 리 간다.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer>
              <OptionNumber>③</OptionNumber>
              <OptionDescription>제 버릇 개 줄까.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer>
              <OptionNumber>④</OptionNumber>
              <OptionDescription>소 잃고 외양간 고친다.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer>
              <OptionNumber>⑤</OptionNumber>
              <OptionDescription>꿈보다 해몽이 좋다.</OptionDescription>
            </OptionContentContainer>
          </OptionContainer>
        )}
      </QuizContainer>
    </QuizSection>
  );
}
