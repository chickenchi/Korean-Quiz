"use client";
import {
  articleAtom,
  choiceDescriptionAtom,
  correctAnswerAtom,
  correctAnswerOXAtom,
  explanationAtom,
  guideAtom,
  hintAtom,
  previewAtom,
  questionTitleAtom,
  selectedViewAtom,
  showPreviewAtom,
  typeAtom,
} from "@/app/atom/makeQuizAtom";
import { openExplanationSheetState, openViewState } from "@/app/atom/quizAtom";
import QuizView from "@/app/components/View";
import ExplanationSheet from "@/app/components/explanation_sheet/ExplanationSheet";
import { getCircleNumber } from "@/app/tools/getCircleNumber";
import { Bookmark, DisabledBookmark } from "@/public/svgs/ListSVG";
import {
  Correct,
  Divider,
  Draw,
  ShowView,
  ToggleTag,
  Write,
  Wrong,
} from "@/public/svgs/QuizSVG";
import { useAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";
import { ParsedText } from "@/app/components/ParsedText";
import { infoConfigState } from "@/app/atom/modalAtom";

const Header = () => {
  return (
    <div className="relative w-full h-[15%] flex items-center justify-center">
      <div className="absolute left-4 top-7">
        <Image
          src="/images/logo/Logo.png"
          alt="평명"
          width={80}
          height={30}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
};

export const MultipleChoice = () => {
  // options, correctNumber

  const [choiceDescription] = useAtom(choiceDescriptionAtom);

  if (!choiceDescription.size) return null;

  return (
    <div className="ml-10 flex flex-col">
      {[...choiceDescription].map((option, index) => {
        const [desc, isCorrect] = option[1];

        return (
          <div
            className={`w-[90%] flex items-start mb-5 ${isCorrect ? "text-[#E04E92]" : "text-black"}`}
            key={index}
          >
            <div className="mr-2 text-xl shrink-0">
              {getCircleNumber(index)}
            </div>
            <div className="text-xl break-all">{desc}</div>
          </div>
        );
      })}
    </div>
  );
};

export const TextInput = () => {
  const [guide] = useAtom(guideAtom);
  const [questionAnswer] = useAtom(correctAnswerAtom);

  return (
    <div className="w-full flex justify-center flex-col">
      {guide && (
        <p
          className="w-[90%] ml-5 pb-2
      text-center text-lg text-[#727272]"
        >
          {guide}
        </p>
      )}
      <input
        className="w-[90%] h-11
        border border-[#727272] rounded
        ml-5 pl-5
        text-[#727272]"
        type="text"
        placeholder="정답을 입력해 주세요"
        value={questionAnswer}
        disabled
      />
    </div>
  );
};

export const OX = () => {
  const [questionAnswerOX] = useAtom(correctAnswerOXAtom);

  return (
    <div className="flex flex-row justify-center items-flex-start">
      <button disabled>
        <Correct lineColor={questionAnswerOX == "O" ? "#E04E92" : "#FFC7E2"} />
      </button>
      <div>
        <Divider lineColor={questionAnswerOX ? "#E04E92" : "#FFC7E2"} />
      </div>
      <button disabled>
        <Wrong lineColor={questionAnswerOX == "X" ? "#E04E92" : "#FFC7E2"} />
      </button>
    </div>
  );
};

const Section = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tagActive, setTagActive] = useState(false);

  const [, setOpenView] = useAtom(openViewState);

  const [questionTitle] = useAtom(questionTitleAtom);
  const [selectedView] = useAtom(selectedViewAtom);
  const [type] = useAtom(typeAtom);

  return (
    <div className="w-full h-[75%]">
      <div className="relative mb-5 w-full h-[7%]">
        <div className="absolute left-5">
          <button onClick={() => setTagActive(!tagActive)}>
            <ToggleTag />
          </button>
          {/* {tagActive && (
            <div>
              {question.tag.map((tag) => {
                return <Tag>{tag}</Tag>;
              })}
            </div>
          )} */}
        </div>
        <div className="absolute right-5 flex items-center">
          <button className="mr-2">
            <Draw />
          </button>
          <button className="mr-3">
            <Write />
          </button>
          <button onClick={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? <Bookmark /> : <DisabledBookmark />}
          </button>
        </div>
      </div>

      <div
        className="h-[80%] overflow-y-auto
    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
    flex flex-col"
      >
        <div className="w-[90%] mb-10 flex items-center">
          <div className="relative ml-10 text-3xl font-bold">00</div>
          <div className="w-[80%] ml-5 text-2xl">
            <ParsedText text={questionTitle} />
            <div
              className="inline-block align-middle ml-1 mb-1"
              onClick={() => setOpenView(true)}
            >
              {(selectedView === "article" && <ShowView type="article" />) ||
                (selectedView === "image" && <ShowView type="image" />)}
            </div>
          </div>
        </div>

        {type.value == "multiple-choice" ? (
          <MultipleChoice />
        ) : type.value == "text-input" ? (
          <TextInput />
        ) : type.value == "ox" ? (
          <OX />
        ) : (
          <>뭔가 잘못된 것 같은데요?</>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const [, setExplanationSheet] = useAtom(openExplanationSheetState);
  const [, setShowPreview] = useAtom(showPreviewAtom);

  const [, setInfoConfig] = useAtom(infoConfigState);

  const [hint] = useAtom(hintAtom);

  const showHint = () => {
    if (!hint) {
      setInfoConfig({
        content: "힌트가 없습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } else {
      setInfoConfig({
        content: hint,
        onClose: () => {
          setInfoConfig(null);
        },
      });
    }
  };

  const buttonStyle = "flex-1 self-start py-2 b-4 border rounded text-lg";

  return (
    <div className="w-full h-[10%] flex items-center justify-center">
      <div className="w-[90%] mb-2 flex gap-2">
        <button className={buttonStyle} onClick={() => showHint()}>
          힌트
        </button>
        <button
          className={buttonStyle}
          onClick={() => setExplanationSheet(true)}
        >
          해설
        </button>
        <button className={buttonStyle} onClick={() => setShowPreview(false)}>
          돌아가기
        </button>
      </div>
    </div>
  );
};

export const Preview = () => {
  const [showPreview] = useAtom(showPreviewAtom);
  const [image] = useAtom(previewAtom);
  const [article] = useAtom(articleAtom);
  const [selectedView] = useAtom(selectedViewAtom);
  const [type] = useAtom(typeAtom);

  const [explanation] = useAtom(explanationAtom);
  const [choiceDescription] = useAtom(choiceDescriptionAtom);

  const [correctAnswer] = useAtom(correctAnswerAtom);
  const [correctAnswerOX] = useAtom(correctAnswerOXAtom);

  if (!showPreview) return;

  const rationale = [...choiceDescription].map(([_, [desc]]) => desc);

  const correctEntry = [...choiceDescription].find(
    ([_, [, isCorrect]]) => isCorrect,
  );
  const selectCorrectAnswer = correctEntry ? String(correctEntry[0]) : "";

  return (
    <div className="absolute w-full h-full bg-white z-10">
      <Header />
      <Section />
      <Footer />
      <QuizView
        image={selectedView === "image" ? image : undefined}
        article={selectedView === "article" ? article : undefined}
      />
      <ExplanationSheet
        commentary={explanation}
        rationale={rationale}
        correctAnswer={
          type.value === "multiple-choice"
            ? selectCorrectAnswer
            : type.value === "ox"
              ? (correctAnswerOX ?? "")
              : (correctAnswer ?? "")
        }
      />
    </div>
  );
};
