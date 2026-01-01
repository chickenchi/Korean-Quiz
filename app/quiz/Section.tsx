"use client";

import { Bookmark, DisabledBookmark } from "@/public/svgs/ListSVG";
import { Draw, ToggleTag, Write } from "@/public/svgs/QuizSVG";
import { useState } from "react";
import styled from "styled-components";
import { answerState } from "../atom/quizAtom";
import { useAtom } from "jotai";

const QuizSection = styled.div`
  width: 100%;
  height: 80%;
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

  width: 180px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  overflow-x: auto;
  overflow-y: hidden;
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
  white-space: nowrap;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
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
const OptionContentContainer = styled.div<{ isActive: boolean }>`
  display: flex;

  margin-bottom: 20px;

  color: ${(props) => (props.isActive ? "#d52e7c" : "black")};
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
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);

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
            <OptionContentContainer
              onClick={() => setQuizAnswer("1")}
              isActive={quizAnswer === "1"}
            >
              <OptionNumber>①</OptionNumber>
              <OptionDescription>
                가는 말이 고와야 오는 말도 곱다.
              </OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer
              onClick={() => setQuizAnswer("2")}
              isActive={quizAnswer === "2"}
            >
              <OptionNumber>②</OptionNumber>
              <OptionDescription>발 없는 말이 천 리 간다.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer
              onClick={() => setQuizAnswer("3")}
              isActive={quizAnswer === "3"}
            >
              <OptionNumber>③</OptionNumber>
              <OptionDescription>제 버릇 개 줄까.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer
              onClick={() => setQuizAnswer("4")}
              isActive={quizAnswer === "4"}
            >
              <OptionNumber>④</OptionNumber>
              <OptionDescription>소 잃고 외양간 고친다.</OptionDescription>
            </OptionContentContainer>
            <OptionContentContainer
              onClick={() => setQuizAnswer("5")}
              isActive={quizAnswer === "5"}
            >
              <OptionNumber>⑤</OptionNumber>
              <OptionDescription>꿈보다 해몽이 좋다.</OptionDescription>
            </OptionContentContainer>
          </OptionContainer>
        )}
      </QuizContainer>
    </QuizSection>
  );
}
