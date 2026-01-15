"use client";

import { Bookmark, DisabledBookmark } from "@/public/svgs/ListSVG";
import {
  Correct,
  Divider,
  Draw,
  ToggleTag,
  Write,
  Wrong,
} from "@/public/svgs/QuizSVG";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  answerState,
  hintState,
  questionState,
  timeState,
  viewedQuizState,
} from "../atom/quizAtom";
import { useAtom } from "jotai";
import { selectQuestion } from "./tools/select_question";
import { formatNumber } from "./tools/format_number";
import { parseTextStyle } from "./tools/parse_text_style";

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

/* Tag */
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

  -ms-overflow-style: none;
  scrollbar-width: none;

  .hide-scroll::-webkit-scrollbar {
    display: none;
  }
`;

const Tag = styled.div`
  width: auto;
  height: 28px;

  margin-right: 5px;
  padding: 0px 15px;

  border: 1px solid black;
  border-radius: 7px;

  color: black;
  font-size: 10pt;
  white-space: nowrap;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

/* Art Content */
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

/* Title */
const QuizTitleContainer = styled.div`
  width: 90%;

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

const QuizTitleText = styled.span<{ $bold?: boolean; $italic?: boolean }>`
  font-weight: ${({ $bold }) => ($bold ? 700 : 400)};
  font-style: ${({ $italic }) => ($italic ? "italic" : "normal")};
`;

/* Option */
const OptionContainer = styled.div`
  margin-left: 30px;

  display: flex;
  flex-direction: column;
`;

const OptionContentContainer = styled.div<{ $isActive: boolean }>`
  width: 90%;

  display: flex;

  margin-bottom: 20px;

  color: ${({ $isActive }) => ($isActive ? "#d52e7c" : "black")};
`;

const OptionNumber = styled.div`
  margin-right: 5px;

  font-size: 15pt;
`;

const OptionDescription = styled.div`
  font-size: 15pt;
`;

const SelectAnswer = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  margin-left: 15;
  margin-top: 0;
`;

const DividerContainer = styled.div``;

const CorrectButton = styled.div``;

const WrongButton = styled.div``;

const InputAnswer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;

  margin-left: 15;
  margin-top: 0;
`;

const Guide = styled.p`
  width: 80%;

  font-size: 17px;
`;

const Input = styled.input`
  height: 50px;
  width: 70%;

  border-color: #888888;
  border-radius: 10px;
  border-width: 1px;

  padding-left: 10px;

  color: #888888;

  font-family: "Cafe24Oneprettynight";
  font-size: 16px;

  outline: none;
`;

export const MultipleChoice = ({
  options,
}: {
  options: string[] | undefined;
}) => {
  if (options === undefined) return null;

  const [quizAnswer, setQuizAnswer] = useAtom(answerState);

  return (
    <OptionContainer>
      {options.map((option, index) => {
        const answerNumber = String(index + 1);

        return (
          <OptionContentContainer
            key={index}
            onClick={() => setQuizAnswer(answerNumber)}
            $isActive={quizAnswer === answerNumber}
          >
            <OptionNumber>{String.fromCharCode(9312 + index)}</OptionNumber>
            <OptionDescription>{option}</OptionDescription>
          </OptionContentContainer>
        );
      })}
    </OptionContainer>
  );
};

export const TextInput = ({ guide }: { guide: string | undefined }) => {
  if (!guide) return;

  const [quizAnswer, setQuizAnswer] = useAtom(answerState);

  const handleQuizAnswerChange = (e: any) => {
    setQuizAnswer(e.target.value);
  };

  return (
    <InputAnswer>
      <Guide>{guide}</Guide>
      <Input
        value={quizAnswer}
        onChange={handleQuizAnswerChange}
        type="text"
        placeholder="정답을 입력해 주세요"
      />
    </InputAnswer>
  );
};

export const OX = () => {
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);

  return (
    <SelectAnswer>
      <CorrectButton onClick={() => setQuizAnswer("O")}>
        <Correct lineColor={quizAnswer == "O" ? "#E04E92" : "#FFC7E2"} />
      </CorrectButton>
      <DividerContainer>
        <Divider lineColor={quizAnswer ? "#E04E92" : "#FFC7E2"} />
      </DividerContainer>
      <WrongButton onClick={() => setQuizAnswer("X")}>
        <Wrong lineColor={quizAnswer == "X" ? "#E04E92" : "#FFC7E2"} />
      </WrongButton>
    </SelectAnswer>
  );
};

export default function Section() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tagActive, setTagActive] = useState(false);
  const [, setQuizAnswer] = useAtom(answerState);
  const [question, setQuestion] = useAtom(questionState);
  const [viewedQuiz, setViewedQuiz] = useAtom(viewedQuizState);
  const [, setTime] = useAtom(timeState);
  const [, setHint] = useAtom(hintState);

  useEffect(() => {
    setQuestion(selectQuestion(viewedQuiz, setViewedQuiz));
  }, []);

  useEffect(() => {
    setQuizAnswer("");
    setTime(0);
    if (question) setHint(question.hint);
  }, [question]);

  if (!question) return null;

  return (
    <QuizSection>
      <QuizContent>
        <TagContainer>
          <TagButton onClick={() => setTagActive(!tagActive)}>
            <ToggleTag />
          </TagButton>
          {tagActive && (
            <TagElementContainer>
              {question.tag.map((tag) => {
                return <Tag>{tag}</Tag>;
              })}
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
          <QuizTitleNumber>
            {formatNumber(question.questionNumber)}
          </QuizTitleNumber>
          <QuizTitleContent>
            {parseTextStyle(question.question).map((part, index) => (
              <QuizTitleText
                key={index}
                $bold={part.bold}
                $italic={part.italic}
              >
                {part.text}
              </QuizTitleText>
            ))}
          </QuizTitleContent>
        </QuizTitleContainer>

        {question.type == "multiple-choice" ? (
          <MultipleChoice options={question.options} />
        ) : question.type == "text-input" ? (
          <TextInput guide={question.guide} />
        ) : question.type == "ox" ? (
          <OX />
        ) : (
          <>뭔가 잘못된 것 같은데요?</>
        )}
      </QuizContainer>
    </QuizSection>
  );
}
