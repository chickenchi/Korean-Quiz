"use client";

import { Bookmark, DisabledBookmark } from "@/public/svgs/ListSVG";
import {
  Correct,
  CorrectAnswer,
  Divider,
  Draw,
  ShowView,
  ToggleTag,
  Write,
  Wrong,
  WrongAnswer,
} from "@/public/svgs/QuizSVG";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  answerState,
  hintState,
  openViewState,
  questionState,
  showResultState,
  startedState,
  timeState,
  viewedQuizState,
} from "../atom/quizAtom";
import { useAtom } from "jotai";
import { selectQuestion } from "./tools/select_question";
import { formatNumber } from "./tools/format_number";
import { parseTextStyle } from "./tools/parse_text_style";

const QuizSection = styled.div<{ $started: boolean; $showResult: boolean }>`
  width: 100%;
  height: 80%;

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  display: ${({ $started, $showResult }) =>
    $started || $showResult ? "block" : "none"};
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
  height: 80%;

  overflow-y: auto;

  -ms-overflow-style: none;
  scrollbar-width: none;

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

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
  position: relative;

  margin-left: 30px;

  font-size: 23pt;
  font-weight: 600;
`;

const MarkupContainer = styled.div`
  position: absolute;

  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const QuizTitleContent = styled.span`
  width: 80%;

  margin-top: 10px;
  margin-left: 20px;

  font-size: 17pt;
  font-weight: 400;
`;

const ShowViewContainer = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.25rem;
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

const OptionContentContainer = styled.button<{
  $isActive: boolean;
  $correctNumber: boolean;
}>`
  background-color: transparent;
  border: none;

  width: 90%;

  display: flex;

  margin-bottom: 20px;

  text-align: left;
  color: ${({ $isActive, $correctNumber }) =>
    $correctNumber ? "#D52E7C" : $isActive ? "#949494" : "black"};
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
  align-items: flex-start;

  width: 100%;

  margin-left: 15;
  margin-top: 0;
`;

const CorrectButton = styled.button`
  height: 70px;

  background-color: transparent;
  border: none;

  margin: 0;
  padding: 0;
`;

const DividerContainer = styled.div``;

const WrongButton = styled.button`
  height: 70px;

  background-color: transparent;
  border: none;

  margin: 0;
  padding: 0;
`;

const InputAnswer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  width: 100%;
`;

const Guide = styled.p`
  width: 80%;

  margin-left: 30px;

  text-align: center;
  font-size: 17px;
`;

const Input = styled.input`
  height: 50px;
  width: 80%;

  border-color: #888888;
  border-radius: 10px;
  border-width: 1px;

  margin-left: 30px;
  padding-left: 10px;

  color: #888888;

  font-size: 16px;

  outline: none;
`;

export const MultipleChoice = ({
  options,
  correctNumber,
}: {
  options: string[] | undefined;
  correctNumber: number | string;
}) => {
  if (options === undefined) return null;

  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [showResult] = useAtom(showResultState);

  return (
    <OptionContainer>
      {options.map((option, index) => {
        const answerNumber = String(index + 1);
        const isCorrect =
          typeof correctNumber === "number"
            ? Number(answerNumber) === correctNumber
            : answerNumber === correctNumber;

        return (
          <OptionContentContainer
            key={index}
            onClick={() => setQuizAnswer(answerNumber)}
            $isActive={quizAnswer === answerNumber}
            $correctNumber={showResult && isCorrect}
            disabled={showResult}
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
  const [showResult] = useAtom(showResultState);

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
        disabled={showResult}
      />
    </InputAnswer>
  );
};

export const OX = () => {
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [showResult] = useAtom(showResultState);

  return (
    <SelectAnswer>
      <CorrectButton onClick={() => setQuizAnswer("O")} disabled={showResult}>
        <Correct lineColor={quizAnswer == "O" ? "#E04E92" : "#FFC7E2"} />
      </CorrectButton>
      <DividerContainer>
        <Divider lineColor={quizAnswer ? "#E04E92" : "#FFC7E2"} />
      </DividerContainer>
      <WrongButton onClick={() => setQuizAnswer("X")} disabled={showResult}>
        <Wrong lineColor={quizAnswer == "X" ? "#E04E92" : "#FFC7E2"} />
      </WrongButton>
    </SelectAnswer>
  );
};

export default function Section() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tagActive, setTagActive] = useState(false);

  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [question, setQuestion] = useAtom(questionState);

  const [showResult] = useAtom(showResultState);
  const [started] = useAtom(startedState);

  const [, setTime] = useAtom(timeState);
  const [, setHint] = useAtom(hintState);
  const [, setOpenView] = useAtom(openViewState);

  useEffect(() => {
    if (showResult) return;

    setQuestion(selectQuestion());
  }, []);

  useEffect(() => {
    if (showResult) return;

    setQuizAnswer("");
    setTime(0);
    setHint(question?.hint);
  }, [question]);

  if (!question) return null;

  const isCorrect =
    typeof question.correctAnswer === "number"
      ? Number(question.correctAnswer) === Number(quizAnswer)
      : question.correctAnswer === quizAnswer;

  return (
    <QuizSection $started={started} $showResult={showResult}>
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
            {showResult && (
              <MarkupContainer>
                {isCorrect ? <CorrectAnswer /> : <WrongAnswer />}
              </MarkupContainer>
            )}
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
            <ShowViewContainer onClick={() => setOpenView(true)}>
              {(question.article && <ShowView type="article" />) ||
                (question.image && <ShowView type="image" />)}
            </ShowViewContainer>
          </QuizTitleContent>
        </QuizTitleContainer>

        {question.type == "multiple-choice" ? (
          <MultipleChoice
            options={question.options}
            correctNumber={question.correctAnswer}
          />
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
