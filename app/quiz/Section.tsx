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
import {
  answerState,
  hintState,
  openViewState,
  questionState,
  showResultState,
  startedState,
  timeState,
} from "../atom/quizAtom";
import { useAtom } from "jotai";
import { selectQuestion } from "./tools/select_question";
import { ParsedText } from "../components/ParsedText";

// --- Sub Components (Tailwind 적용) ---

export const MultipleChoice = ({
  options,
  correctNumber,
}: {
  options: { description: string }[] | undefined;
  correctNumber: number | string;
}) => {
  if (!options) return null;
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [showResult] = useAtom(showResultState);

  return (
    <div className="flex flex-col ml-[30px] space-y-5">
      {options.map((option, index) => {
        const answerNumber = String(index + 1);
        const isCorrect = String(answerNumber) === String(correctNumber);

        // 정답 시 핑크색, 선택 시 회색, 기본 검정
        const textColor =
          showResult && isCorrect
            ? "text-[#D52E7C]"
            : quizAnswer === answerNumber
              ? "text-[#949494]"
              : "text-black";

        return (
          <button
            key={index}
            onClick={() => setQuizAnswer(answerNumber)}
            disabled={showResult}
            className={`flex w-[90%] text-left bg-transparent border-none outline-none ${textColor}`}
          >
            <span className="mr-[5px] text-[20px]">
              {String.fromCharCode(9312 + index)}
            </span>
            <span className="text-[20px]">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TextInput = ({ guide }: { guide: string | undefined }) => {
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [showResult] = useAtom(showResultState);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {guide && (
        <p className="w-[80%] text-center text-[17px] text-gray-600">{guide}</p>
      )}
      <input
        value={quizAnswer}
        onChange={(e) => setQuizAnswer(e.target.value)}
        type="text"
        placeholder="정답을 입력해 주세요"
        disabled={showResult}
        className="h-[50px] w-[80%] px-[10px] border border-[#888888] rounded-[10px] text-[#888888] text-[16px] outline-none disabled:bg-gray-50"
      />
    </div>
  );
};

export const OX = () => {
  const [quizAnswer, setQuizAnswer] = useAtom(answerState);
  const [showResult] = useAtom(showResultState);

  const activeColor = "#E04E92";
  const inactiveColor = "#FFC7E2";

  return (
    <div className="flex justify-center items-start w-full mt-0">
      <button
        onClick={() => setQuizAnswer("O")}
        disabled={showResult}
        className="h-[70px] bg-transparent border-none"
      >
        <Correct lineColor={quizAnswer === "O" ? activeColor : inactiveColor} />
      </button>
      <div className="flex items-center h-[70px]">
        <Divider lineColor={quizAnswer ? activeColor : inactiveColor} />
      </div>
      <button
        onClick={() => setQuizAnswer("X")}
        disabled={showResult}
        className="h-[70px] bg-transparent border-none"
      >
        <Wrong lineColor={quizAnswer === "X" ? activeColor : inactiveColor} />
      </button>
    </div>
  );
};

// --- Main Section ---

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
    const getQuestion = async () => setQuestion(await selectQuestion());
    getQuestion();
  }, []);

  useEffect(() => {
    if (showResult) return;
    setQuizAnswer("");
    setTime(0);
    setHint(question?.hint);
  }, [question]);

  if (!question) return null;

  const isCorrect = String(question.correctAnswer) === String(quizAnswer);

  return (
    <div
      className={`w-full h-[80%] ${started || showResult ? "block" : "hidden"}`}
    >
      {/* QuizContent (Header Tool Bar) */}
      <div className="relative flex items-center w-full h-[7%] mb-5">
        {/* Tags */}
        <div className="absolute mt-4 left-4 flex items-center h-full">
          <button
            onClick={() => setTagActive(!tagActive)}
            className="bg-transparent border-none text-black"
          >
            <ToggleTag />
          </button>
          {tagActive && (
            <div className="flex items-center ml-[5px] w-[180px] overflow-x-auto overflow-y-hidden scrollbar-hide">
              {question.tag.map((tag, i) => (
                <div
                  key={i}
                  className="h-[28px] px-[15px] mr-[5px] border border-black rounded-[7px] text-[10pt] whitespace-nowrap flex items-center shrink-0"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Art Tools */}
        <div className="absolute mt-4 right-6 flex items-center space-x-3">
          <button className="bg-transparent border-none">
            <Draw />
          </button>
          <button className="bg-transparent border-none">
            <Write />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="bg-transparent border-none"
          >
            {isBookmarked ? <Bookmark /> : <DisabledBookmark />}
          </button>
        </div>
      </div>

      {/* QuizContainer */}
      <div className="flex flex-col h-[80%] overflow-y-auto scrollbar-hide">
        {/* Title Container */}
        <div className="flex items-center w-[90%] mt-2 mb-5">
          <div className="relative ml-[30px] text-[23pt] font-semibold">
            00
            {showResult && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {isCorrect ? <CorrectAnswer /> : <WrongAnswer />}
              </div>
            )}
          </div>
          <div className="w-[80%] mt-[10px] ml-5 text-[17pt] font-normal">
            <ParsedText text={question.question} />
            <span
              className="inline-block align-middle ml-1 cursor-pointer"
              onClick={() => setOpenView(true)}
            >
              {(question.article && <ShowView type="article" />) ||
                (question.image && <ShowView type="image" />)}
            </span>
          </div>
        </div>

        {/* Answer Types */}
        <div className="pb-10">
          {question.type === "multiple-choice" ? (
            <MultipleChoice
              options={question.options}
              correctNumber={question.correctAnswer}
            />
          ) : question.type === "text-input" ? (
            <TextInput guide={question.guide} />
          ) : question.type === "ox" ? (
            <OX />
          ) : (
            <div className="text-center text-red-500">
              데이터 형식이 올바르지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
