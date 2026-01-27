"use client";
import {
  articleAtom,
  choiceDescriptionAtom,
  correctAnswerAtom,
  correctAnswerOXAtom,
  explanationAtom,
  guideAtom,
  previewAtom,
  selectedViewAtom,
  typeAtom,
  typeOption,
} from "@/app/atom/makeQuizAtom";

import { previewConfigAtom } from "@/app/atom/reqAdminAtom";
import { openExplanationSheetState, openViewState } from "@/app/atom/quizAtom";
import { infoConfigState } from "@/app/atom/modalAtom";
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
import { useEffect, useState } from "react";
import { ParsedText } from "@/app/components/ParsedText";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/client";
import { questionData } from "../page";

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

export const MultipleChoice = ({
  options,
  correctAnswer,
}: {
  options: { description: string }[];
  correctAnswer: string | undefined;
}) => {
  // options, correctNumber

  if (!options || !correctAnswer) return;

  return (
    <div className="ml-10 flex flex-col">
      {options.map((option, index) => {
        return (
          <div
            className={`w-[90%] flex items-start mb-5 ${correctAnswer === String(index) ? "text-[#E04E92]" : "text-black"}`}
            key={index}
          >
            <div className="mr-2 text-xl shrink-0">
              {getCircleNumber(index)}
            </div>
            <div className="text-xl break-all">{option.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export const TextInput = ({
  guide,
  correctAnswer,
}: {
  guide: string | undefined;
  correctAnswer: string | undefined;
}) => {
  if (!guide || !correctAnswer) return;

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
        value={correctAnswer}
        disabled
      />
    </div>
  );
};

export const OX = ({
  correctAnswer,
}: {
  correctAnswer: string | undefined;
}) => {
  if (!correctAnswer) return;

  return (
    <div className="flex flex-row justify-center items-flex-start">
      <button disabled>
        <Correct lineColor={correctAnswer == "O" ? "#E04E92" : "#FFC7E2"} />
      </button>
      <div>
        <Divider lineColor={correctAnswer ? "#E04E92" : "#FFC7E2"} />
      </div>
      <button disabled>
        <Wrong lineColor={correctAnswer == "X" ? "#E04E92" : "#FFC7E2"} />
      </button>
    </div>
  );
};

const Section = ({
  questionTitle,
  selectedView,
  type,
  guide,
  correctAnswer,
  options,
}: {
  questionTitle: string;
  selectedView: "none" | "image" | "article";
  type: string;
  guide?: string;
  correctAnswer?: string;
  options?: { description: string }[];
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tagActive, setTagActive] = useState(false);

  const [, setOpenView] = useAtom(openViewState);

  if (!options) return;

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

        {type == "multiple-choice" ? (
          <MultipleChoice options={options} correctAnswer={correctAnswer} />
        ) : type == "text-input" ? (
          <TextInput guide={guide} correctAnswer={correctAnswer} />
        ) : type == "ox" ? (
          <OX correctAnswer={correctAnswer} />
        ) : (
          <>뭔가 잘못된 것 같은데요?</>
        )}
      </div>
    </div>
  );
};

const Footer = ({ hint }: { hint: string | undefined }) => {
  const [, setExplanationSheet] = useAtom(openExplanationSheetState);
  const [, setShowPreview] = useAtom(previewConfigAtom);

  const [, setInfoConfig] = useAtom(infoConfigState);

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
        <button className={buttonStyle} onClick={() => setShowPreview(null)}>
          돌아가기
        </button>
      </div>
    </div>
  );
};

export const RequestedPreview = () => {
  const [previewId] = useAtom(previewConfigAtom);
  const [requestedQuizList, setRequestedQuizList] =
    useState<questionData | null>(null);

  useEffect(() => {
    if (!previewId) {
      setRequestedQuizList(null);
      return;
    }

    const col = collection(db, "requested");

    const unsubscribe = onSnapshot(col, (snapshot) => {
      const foundDoc = snapshot.docs.find((doc) => doc.id === previewId);

      const rQL = foundDoc
        ? {
            ...(foundDoc.data() as questionData),
            id: foundDoc.id,
          }
        : null;

      setRequestedQuizList(rQL);
    });

    return () => unsubscribe();
  }, [previewId]);

  if (!previewId || !requestedQuizList) return;

  const selectedView = requestedQuizList.image
    ? "image"
    : requestedQuizList.article
      ? "article"
      : "none";

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-10">
      <Header />
      <Section
        questionTitle={requestedQuizList.question}
        selectedView={selectedView}
        type={requestedQuizList.type}
        guide={requestedQuizList.guide}
        correctAnswer={String(requestedQuizList.correctAnswer)}
        options={requestedQuizList.options}
      />
      <Footer hint={requestedQuizList.hint} />
      <QuizView
        image={selectedView === "image" ? requestedQuizList.image : undefined}
        article={
          selectedView === "article" ? requestedQuizList.article : undefined
        }
      />
      <ExplanationSheet
        commentary={requestedQuizList.commentary}
        rationale={requestedQuizList.rationale}
        correctAnswer={String(requestedQuizList.correctAnswer)}
      />
    </div>
  );
};
