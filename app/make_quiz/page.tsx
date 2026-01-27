"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";

import TextareaAutosize from "react-textarea-autosize";
import {
  articleAtom,
  choiceDescriptionAtom,
  choiceExplanationAtom,
  correctAnswerAtom,
  correctAnswerOXAtom,
  explanationAtom,
  focusTargetAtom,
  guideAtom,
  hintAtom,
  loadingAtom,
  previewAtom,
  questionTitleAtom,
  resetAllWroteItemsAtom,
  selectedViewAtom,
  showPreviewAtom,
  typeAtom,
  typeOptions,
} from "../atom/makeQuizAtom";

import { useAtom } from "jotai";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/client";
import { infoConfigState, loginConfigState } from "../atom/modalAtom";
import { Back } from "@/public/svgs/CategorySVG";
import { Preview } from "./components/Preview";
import { ParsedText } from "../components/ParsedText";
import { useRouter } from "next/navigation";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { userAtom } from "../atom/userAtom";

const Header = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[15%] flex items-center justify-center">
      <h1 className="text-3xl">문제 생성</h1>

      <button
        className="absolute right-6 top-6"
        onClick={() => router.replace("/quiz")}
      >
        <Back />
      </button>
    </div>
  );
};

const Section = () => {
  const textareaStyle = `w-full mt-2 p-2
          border border-gray-300 rounded-md
          px-4 py-3
          outline-none`;

  const choiceStyle = `w-full h-12 mt-2 p-2
        border border-gray-300 rounded-md
        pl-4 pr-8 py-3
        outline-none`;

  const subtitleStyle = `text-2xl`;

  const buttonStyle = `flex-1 px-4 py-2
        border border-[#727272]
        text-[#727272] outline-none`;

  const blankedWarningStyle = `ring ring-[#D52E7C]
  placeholder:text-[#D52E7C] text-[#D52E7C]`;

  // Question Title
  const [questionTitle, setQuestionTitle] = useAtom(questionTitleAtom);
  const questionTitleRef = useRef<HTMLTextAreaElement>(null);

  const handleQuestionTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionTitle(e.target.value);
  };

  // Style Guide & Special Chars
  const [showStyleGuide, setShowStyleGuide] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);

  // Type
  const [type, setType] = useAtom(typeAtom);
  const typeRef = useRef<HTMLDivElement>(null);

  // Choice Description
  const [choiceDescriptions, setChoiceDescriptions] = useAtom(
    choiceDescriptionAtom,
  );
  const choiceDescriptionsRef = useRef<Map<number, HTMLTextAreaElement | null>>(
    new Map<number, HTMLTextAreaElement | null>(),
  );

  const handleChoiceDescriptionChange = (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newChoiceDescriptions = new Map(choiceDescriptions);
    newChoiceDescriptions.set(index, [
      e.target.value,
      newChoiceDescriptions.get(index)?.[1] || false,
    ]);
    setChoiceDescriptions(newChoiceDescriptions);
  };

  // Correct Answer
  const [correctAnswer, setCorrectAnswer] = useAtom(correctAnswerAtom);
  const correctAnswerRef = useRef<HTMLTextAreaElement>(null);

  const handleCorrectAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCorrectAnswer(e.target.value);
  };

  // Guide
  const [guide, setGuide] = useAtom(guideAtom);

  const handleGuideChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setGuide(e.target.value);
  };

  const [correctAnswerOX, setCorrectAnswerOX] = useAtom(correctAnswerOXAtom);
  const correctAnswerOXRef = useRef<HTMLDivElement>(null);

  // View
  const [selectedView, setSelectedView] = useAtom(selectedViewAtom);

  // Image
  const [preview, setPreview] = useAtom(previewAtom);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Article
  const [article, setArticle] = useAtom(articleAtom);
  const articleRef = useRef<HTMLTextAreaElement>(null);

  const handleArticleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value);
  };

  // Hint
  const [hint, setHint] = useAtom(hintAtom);

  const handleHintChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHint(e.target.value);
  };

  // Explanation
  const [explanation, setExplanation] = useAtom(explanationAtom);
  const explanationRef = useRef<HTMLTextAreaElement>(null);

  const handleExplanationChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setExplanation(e.target.value);
  };

  // Choice Explanation
  const [choiceExplanations, setChoiceExplanations] = useAtom(
    choiceExplanationAtom,
  );
  const textRefs = useRef<Map<number, HTMLTextAreaElement | null>>(
    new Map<number, HTMLTextAreaElement | null>(),
  );

  const handleChoiceExplanationChange = (
    index: number,
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newChoiceExplanations = new Map(choiceExplanations);
    newChoiceExplanations.set(index, e.target.value);
    setChoiceExplanations(newChoiceExplanations);
  };

  const [focusTarget] = useAtom(focusTargetAtom);

  useEffect(() => {
    switch (focusTarget?.split("-")[0]) {
      case "questionTitle":
        questionTitleRef.current?.focus();
        break;
      case "type":
        typeRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "cDescription":
        if (choiceDescriptionsRef.current.size > 0) {
          const firstEmpty = [...choiceDescriptions].find(
            ([, [desc]]) => desc.trim() === "",
          );

          if (firstEmpty) {
            choiceDescriptionsRef.current.get(firstEmpty[0])?.focus();
          } else {
            // 맨 첫번째로 포커스

            const firstKey = Math.min(
              ...Array.from(choiceDescriptionsRef.current.keys()),
            );
            choiceDescriptionsRef.current.get(firstKey)?.focus();
          }
        }
        break;
      case "cExplanation":
        if (textRefs.current.size > 0) {
          const firstEmpty = [...textRefs.current].find(
            ([, desc]) => desc?.value.trim() === "",
          );

          if (firstEmpty) {
            textRefs.current.get(firstEmpty[0])?.focus();
          }
        }
        break;
      case "correctAnswer":
        correctAnswerRef.current?.focus();
        break;
      case "correctAnswerOX":
        correctAnswerOXRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "view":
        typeRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "preview":
        imageRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "article":
        articleRef.current?.focus();
        break;
      case "explanation":
        explanationRef.current?.focus();
        break;
      default:
        break;
    }
  }, [focusTarget]);

  const isAnythingWritten =
    explanation.trim() !== "" ||
    [...choiceExplanations.values()].some((v) => v.trim() !== "");

  const showExplanationWarning =
    focusTarget &&
    (type.value === "multiple-choice"
      ? !explanation &&
        ![...choiceExplanations.values()].some((desc) => desc.trim() !== "")
      : !explanation && type.value !== "multiple-choice");

  const SPECIAL_CHARS = [
    { label: "√", value: "√" },
    { label: "±", value: "±" },
    { label: "×", value: "×" },
    { label: "÷", value: "÷" },
  ];

  return (
    <div
      id="section"
      className="w-full h-[75%] overflow-y-auto
    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <p
        id="guide"
        className="w-[90%] mb-4 ml-4
      text text-[#D52E7C]"
      >
        [*] 필수 항목 [^] 선택형 필수 항목
      </p>
      <div id="question-title-container" className="w-[90%] mb-6 ml-4">
        <div className="relative flex items-center">
          <h2 className={subtitleStyle}>
            지시문<span className="text-[#D52E7C]">*</span>
          </h2>

          <div className="relative ml-2">
            <button
              className="flex items-center justify-center"
              onClick={() => setShowStyleGuide(!showStyleGuide)}
            >
              <svg width="17" height="17" viewBox="0 0 13 13" fill="none">
                <path
                  d="M7.25 9.75C7.25 9.89834 7.20602 10.0433 7.1236 10.1667C7.04119 10.29 6.92406 10.3861 6.78701 10.4429C6.64997 10.4997 6.49917 10.5145 6.35368 10.4856C6.2082 10.4567 6.07456 10.3852 5.96967 10.2803C5.86478 10.1754 5.79335 10.0418 5.76441 9.89632C5.73547 9.75083 5.75033 9.60003 5.80709 9.46299C5.86386 9.32594 5.95999 9.20881 6.08333 9.1264C6.20666 9.04399 6.35167 9 6.5 9C6.69892 9 6.88968 9.07902 7.03033 9.21967C7.17098 9.36032 7.25 9.55109 7.25 9.75ZM6.5 3C5.12125 3 4 4.00937 4 5.25V5.5C4 5.63261 4.05268 5.75979 4.14645 5.85355C4.24022 5.94732 4.36739 6 4.5 6C4.63261 6 4.75979 5.94732 4.85356 5.85355C4.94732 5.75979 5 5.63261 5 5.5V5.25C5 4.5625 5.67313 4 6.5 4C7.32688 4 8 4.5625 8 5.25C8 5.9375 7.32688 6.5 6.5 6.5C6.36739 6.5 6.24022 6.55268 6.14645 6.64645C6.05268 6.74021 6 6.86739 6 7V7.5C6 7.63261 6.05268 7.75979 6.14645 7.85355C6.24022 7.94732 6.36739 8 6.5 8C6.63261 8 6.75979 7.94732 6.85356 7.85355C6.94732 7.75979 7 7.63261 7 7.5V7.455C8.14 7.24562 9 6.33625 9 5.25C9 4.00937 7.87875 3 6.5 3ZM13 6.5C13 7.78558 12.6188 9.04229 11.9046 10.1112C11.1903 11.1801 10.1752 12.0132 8.98744 12.5052C7.79973 12.9972 6.49279 13.1259 5.23192 12.8751C3.97104 12.6243 2.81285 12.0052 1.90381 11.0962C0.994767 10.1872 0.375703 9.02896 0.124899 7.76809C-0.125905 6.50721 0.00281635 5.20028 0.494786 4.01256C0.986756 2.82484 1.81988 1.80968 2.8888 1.09545C3.95772 0.381218 5.21442 0 6.5 0C8.22335 0.00181989 9.87559 0.687224 11.0942 1.90582C12.3128 3.12441 12.9982 4.77665 13 6.5ZM12 6.5C12 5.4122 11.6774 4.34883 11.0731 3.44436C10.4687 2.53989 9.60976 1.83494 8.60476 1.41866C7.59977 1.00238 6.4939 0.893462 5.42701 1.10568C4.36011 1.3179 3.3801 1.84172 2.61092 2.61091C1.84173 3.3801 1.3179 4.36011 1.10568 5.427C0.893465 6.4939 1.00238 7.59977 1.41867 8.60476C1.83495 9.60975 2.5399 10.4687 3.44437 11.0731C4.34884 11.6774 5.41221 12 6.5 12C7.95819 11.9983 9.35617 11.4184 10.3873 10.3873C11.4184 9.35617 11.9983 7.95818 12 6.5Z"
                  fill="#727272"
                />
              </svg>
            </button>

            {showStyleGuide && (
              <div
                className="absolute top-full left-0 mt-2 p-2 w-32
      bg-white border border-[#727272] rounded
      flex flex-col text text-[#727272] z-2"
                onClick={() => setShowStyleGuide(false)}
              >
                <span>/*내용*/: 굵게</span>
                <span>/내용/: 기울이기</span>
                <span>_내용_: 밑줄</span>
                <span>^(내용): 위 첨자</span>
                <span> _(내용): 아래 첨자</span>
              </div>
            )}
          </div>

          <div className="relative ml-2">
            <button
              className="flex items-center justify-center"
              onClick={() => setShowSpecialChars(!showSpecialChars)}
            >
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 14C3.14 14 0 10.86 0 7C0 3.14 3.14 0 7 0C10.86 0 14 3.14 14 7C14 10.86 10.86 14 7 14ZM7 1C3.69 1 1 3.69 1 7C1 10.31 3.69 13 7 13C10.31 13 13 10.31 13 7C13 3.69 10.31 1 7 1Z"
                  fill="#727272"
                />
                <path
                  d="M7 10.5C6.72 10.5 6.5 10.28 6.5 10V4C6.5 3.72 6.72 3.5 7 3.5C7.28 3.5 7.5 3.72 7.5 4V10C7.5 10.28 7.28 10.5 7 10.5Z"
                  fill="#727272"
                />
                <path
                  d="M10 7.5H4C3.72 7.5 3.5 7.28 3.5 7C3.5 6.72 3.72 6.5 4 6.5H10C10.28 6.5 10.5 6.72 10.5 7C10.5 7.28 10.28 7.5 10 7.5Z"
                  fill="#727272"
                />
              </svg>
            </button>

            {showSpecialChars && (
              <div
                className="absolute top-full left-0 mt-2 p-2
      bg-white border border-[#727272] rounded
      flex text text-[#727272] z-2"
                onClick={() => setShowStyleGuide(false)}
              >
                {SPECIAL_CHARS.map((char, index) => (
                  <div className="h-full flex flex-row items-center">
                    <button
                      key={char.label}
                      type="button"
                      className="px-2 py-1 hover:bg-gray-100 hover:text-black rounded transition-colors border border-transparent hover:border-gray-200"
                      onClick={() => {
                        setQuestionTitle((prev) => prev + char.value);
                        // 입력 후 팝업을 닫고 싶다면 여기서 처리
                        // setShowSpecialChars(false);
                      }}
                    >
                      {char.label}
                    </button>
                    {index !== SPECIAL_CHARS.length - 1 && (
                      <div className="h-4 w-[1px] bg-[#727272] opacity-50" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <TextareaAutosize
          className={`${textareaStyle}
            ${focusTarget && !questionTitle ? blankedWarningStyle : ""}`}
          placeholder="지시문 입력"
          value={questionTitle}
          onChange={handleQuestionTitleChange}
          ref={questionTitleRef}
        />
        <ParsedText text={questionTitle} />
      </div>
      <div id="type-container" className="w-[90%] mb-8 ml-4 flex items-center">
        <h2 className={subtitleStyle}>문제 유형</h2>
        <Listbox value={type} onChange={setType}>
          <div className="relative mt-1 ml-4" ref={typeRef}>
            {/* 버튼 부분 (Trigger) */}
            <ListboxButton
              className="relative w-30 py-2 pl-4 pr-10 cursor-pointer
                rounded-md border border-[#727272]
                bg-transparent text-left text-[#727272]
                focus:outline-none"
            >
              <span className="block truncate">{type.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {/* 화살표 아이콘 */}
                <svg
                  className="h-5 w-5 text-[#727272]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </ListboxButton>

            {/* 애니메이션 효과 */}
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                className="absolute z-10 mt-1 py-1 w-full
              overflow-auto bg-white
              border border-[#727272] rounded-md
              text-base shadow-lg focus:outline-none sm:text-sm"
              >
                {typeOptions.map((option) => (
                  <ListboxOption
                    key={option.id}
                    className={({ focus }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        focus ? "bg-[#f2f2f2] text-black" : "text-[#727272]"
                      } outline-none`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${selected ? "font-bold" : "font-normal"}`}
                      >
                        {option.name}
                      </span>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div id="tag-container" className="w-[90%] mb-8 ml-4 flex items-center">
        <h2 className={subtitleStyle}>
          태그<span className="text-[#D52E7C]">*</span>
        </h2>
        <div
          className="ml-4 px-4 py-2
        border border-[#727272] rounded-4xl 
        text-[#727272]
        flex items-center"
        >
          실험용
        </div>
      </div>
      {type.value === "multiple-choice" ? (
        <div id="choice-container" className="w-[90%] mb-8 ml-4">
          <h2 className={subtitleStyle}>
            선지별 내용<span className="text-[#D52E7C]">*</span>
          </h2>
          {[...choiceDescriptions].map(([index, [description, isCorrect]]) => (
            <div key={index} className="relative flex items-center">
              <div className="relative w-[90%]">
                <TextareaAutosize
                  className={`${choiceStyle}
                  ${focusTarget && !description ? blankedWarningStyle : ""}`}
                  placeholder="선지 내용 입력"
                  value={description}
                  onChange={(e) => handleChoiceDescriptionChange(index, e)}
                  ref={(el) => {
                    if (el) choiceDescriptionsRef.current.set(index, el);
                  }}
                />

                {choiceDescriptions.size < 3 ? null : (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2
                    w-6 h-6 flex items-center justify-center"
                    onClick={() => {
                      const newChoiceDescriptions = new Map(choiceDescriptions);
                      newChoiceDescriptions.delete(index);
                      setChoiceDescriptions(newChoiceDescriptions);

                      const newChoiceExplanations = new Map(choiceExplanations);
                      newChoiceExplanations.delete(index);
                      setChoiceExplanations(newChoiceExplanations);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M0.75 11.236L5.993 5.993L11.236 11.236M11.236 0.75L5.992 5.993L0.75 0.75"
                        stroke="#727272"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="relative w-[10%] flex justify-center ml-2">
                <button
                  className={`${isCorrect ? "bg-[#D52E7C]" : "bg-[#727272]"} rounded-full w-8 h-8 flex items-center justify-center`}
                  onClick={() => {
                    const newChoiceDescriptions = new Map();

                    choiceDescriptions.forEach(([desc, _], idx) => {
                      newChoiceDescriptions.set(idx, [
                        desc,
                        idx === index ? !isCorrect : false,
                      ]);
                    });

                    setChoiceDescriptions(newChoiceDescriptions);
                  }}
                >
                  <svg width="16" height="12" viewBox="0 0 15 11" fill="none">
                    <path
                      d="M4.76821 8.95757L13.5702 0.156568C13.6675 0.059235 13.7822 0.00723485 13.9142 0.000568181C14.0462 -0.00609849 14.1672 0.0459016 14.2772 0.156568C14.3872 0.267235 14.4425 0.386235 14.4432 0.513568C14.4439 0.640901 14.3889 0.759568 14.2782 0.869568L5.33421 9.81957C5.17221 9.98157 4.98355 10.0626 4.76821 10.0626C4.55288 10.0626 4.36421 9.98157 4.20221 9.81957L0.152212 5.76957C0.0548784 5.67224 0.00421176 5.55657 0.000211765 5.42257C-0.00378824 5.28857 0.0488784 5.16657 0.158212 5.05657C0.267545 4.94657 0.386545 4.89157 0.515212 4.89157C0.643878 4.89157 0.762878 4.94657 0.872212 5.05657L4.76821 8.95757Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {choiceDescriptions.size < 20 && (
            <button
              className={`text-center ${textareaStyle}`}
              onClick={() => {
                const newChoiceDescriptions = new Map(choiceDescriptions);
                const lastKey = Math.max(
                  ...Array.from(newChoiceDescriptions.keys()),
                );

                newChoiceDescriptions.set(lastKey + 1, ["", false]);
                setChoiceDescriptions(newChoiceDescriptions);

                const newChoiceExplanations = new Map(choiceExplanations);
                newChoiceExplanations.set(lastKey + 1, "");
                setChoiceExplanations(newChoiceExplanations);
              }}
            >
              +
            </button>
          )}
        </div>
      ) : type.value === "ox" ? (
        <div id="ox-container" className="w-[90%] mb-8 ml-4">
          <h2 className={subtitleStyle}>
            정답<span className="text-[#D52E7C]">*</span>
          </h2>
          <div
            id="button-group"
            className="flex w-full mt-2"
            ref={correctAnswerOXRef}
          >
            <button
              className={`border-r-0 rounded-l-md
            ${buttonStyle}
            ${correctAnswerOX === "O" && "bg-[#f2f2f2]"}
            active:bg-[#f2f2f2]
              ${focusTarget && correctAnswerOX === null ? blankedWarningStyle : ""}`}
              onClick={() => setCorrectAnswerOX("O")}
            >
              O
            </button>
            <button
              className={`rounded-r-md
            ${buttonStyle}
            ${correctAnswerOX === "X" && "bg-[#f2f2f2]"}
            active:bg-[#f2f2f2]
              ${focusTarget && correctAnswerOX === null ? blankedWarningStyle : ""}`}
              onClick={() => setCorrectAnswerOX("X")}
            >
              X
            </button>
          </div>
        </div>
      ) : (
        type.value === "text-input" && (
          <>
            <div id="text-input-container" className="w-[90%] mb-8 ml-4">
              <h2 className={subtitleStyle}>가이드</h2>
              <TextareaAutosize
                className={textareaStyle}
                value={guide}
                placeholder="가이드 입력"
                onChange={handleGuideChange}
              />
            </div>
            <div id="text-input-container" className="w-[90%] mb-8 ml-4">
              <h2 className={subtitleStyle}>
                정답<span className="text-[#D52E7C]">*</span>
              </h2>
              <TextareaAutosize
                className={`${textareaStyle}
                ${focusTarget && !correctAnswer ? blankedWarningStyle : ""}`}
                value={correctAnswer}
                placeholder="정답 입력"
                onChange={handleCorrectAnswerChange}
                ref={correctAnswerRef}
              />
            </div>
          </>
        )
      )}
      {type.value === "multiple-choice" && (
        <div id="explanation-container" className="w-[90%] mb-8 ml-4">
          <h2 className={subtitleStyle}>
            선지별 해설<span className="text-[#D52E7C]">^</span>
          </h2>

          {[...choiceExplanations].map(([i, value]) => (
            <div key={i}>
              <TextareaAutosize
                className={`${textareaStyle}
                  ${focusTarget && !isAnythingWritten && !choiceExplanations.get(i) ? blankedWarningStyle : ""}`}
                placeholder={`${choiceDescriptions.get(i)?.[0] || "해설 입력"}`}
                value={choiceExplanations.get(i) || ""}
                onChange={(e) => handleChoiceExplanationChange(i, e)}
                ref={(el) => {
                  if (el) textRefs.current.set(i, el);
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div id="solution-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          해설
          {type.value === "multiple-choice" ? (
            <span className="text-[#D52E7C]">^</span>
          ) : (
            <span className="text-[#D52E7C]">*</span>
          )}
        </h2>
        <TextareaAutosize
          className={`${textareaStyle}
            ${showExplanationWarning ? blankedWarningStyle : ""}`}
          placeholder="해설 입력"
          value={explanation}
          onChange={handleExplanationChange}
          ref={explanationRef}
        />
      </div>
      <div id="hint-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>힌트</h2>
        <TextareaAutosize
          className={textareaStyle}
          placeholder="힌트 입력"
          value={hint}
          onChange={handleHintChange}
        />
      </div>
      <div id="view-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>보기</h2>
        <div id="button-group" className="flex w-full mt-2">
          <button
            className={`border-r-0 
            ${selectedView === "image" ? "rounded-tl-md" : "rounded-l-md"}
            ${buttonStyle}
            ${selectedView === "none" ? "bg-[#f2f2f280]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("none")}
          >
            없음
          </button>
          <button
            className={`${buttonStyle}
            ${selectedView === "image" ? "bg-[#F2F2F2]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("image")}
          >
            사진
          </button>
          <button
            className={`border-l-0
            ${selectedView === "image" ? "rounded-tr-md" : "rounded-r-md"}
            ${buttonStyle}
            ${selectedView === "article" ? "bg-[#F2F2F2]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("article")}
          >
            본문
          </button>
        </div>
        {selectedView === "image" ? (
          <div
            id="image-upload-container"
            className="w-full p-4 flex flex-row
            border border-t-0 border-[#727272] rounded-b-md"
          >
            <input
              id="image-upload"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={imageRef}
            />
            <label htmlFor="image-upload">
              <div
                className={`w-26 h-26
                border border-gray-400 rounded-md
                flex items-center justify-center ${focusTarget && !preview ? blankedWarningStyle : ""}`}
              >
                {preview ? (
                  <div className="w-full h-full bg-black">
                    <img
                      src={preview}
                      alt="업로드 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <svg width="35" height="35" viewBox="0 0 27 27" fill="none">
                    <path
                      d="M23.2097 0H3.77517C2.77393 0 1.8137 0.39774 1.10572 1.10572C0.39774 1.8137 0 2.77393 0 3.77517V23.2248C0.00278936 24.2252 0.401425 25.1838 1.1088 25.8912C1.81618 26.5986 2.77479 26.9972 3.77517 27H23.2097C24.2101 26.9972 25.1687 26.5986 25.8761 25.8912C26.5835 25.1838 26.9821 24.2252 26.9849 23.2248V3.77517C26.9849 3.27941 26.8873 2.7885 26.6975 2.33047C26.5078 1.87245 26.2297 1.45628 25.8792 1.10572C25.5286 0.755164 25.1125 0.477087 24.6544 0.287368C24.1964 0.0976476 23.7055 0 23.2097 0ZM1.51007 3.77517C1.51007 3.17443 1.74871 2.59829 2.1735 2.1735C2.59829 1.74871 3.17443 1.51007 3.77517 1.51007H23.2097C23.8105 1.51007 24.3866 1.74871 24.8114 2.1735C25.2362 2.59829 25.4748 3.17443 25.4748 3.77517V16.8523L19.6158 10.9933C19.1891 10.5728 18.6142 10.337 18.0151 10.337C17.4161 10.337 16.8411 10.5728 16.4144 10.9933L9.52852 17.8943C9.3843 18.0325 9.19224 18.1097 8.99245 18.1097C8.79266 18.1097 8.6006 18.0325 8.45638 17.8943L7.61074 17.0487C7.18223 16.6317 6.60795 16.3984 6.01007 16.3984C5.41219 16.3984 4.8379 16.6317 4.4094 17.0487L1.51007 19.948V3.77517ZM25.4748 23.2248C25.4748 23.8256 25.2362 24.4017 24.8114 24.8265C24.3866 25.2513 23.8105 25.4899 23.2097 25.4899H3.77517C3.17443 25.4899 2.59829 25.2513 2.1735 24.8265C1.74871 24.4017 1.51007 23.8256 1.51007 23.2248V22.0923L5.48909 18.1208C5.63094 17.9841 5.82061 17.9082 6.01762 17.9094C6.21925 17.9075 6.4139 17.9831 6.56124 18.1208L7.39178 18.9664C7.81842 19.387 8.3934 19.6227 8.99245 19.6227C9.5915 19.6227 10.1665 19.387 10.5931 18.9664L17.4941 12.0654C17.5643 11.9947 17.6478 11.9385 17.7398 11.9002C17.8318 11.8618 17.9305 11.8421 18.0302 11.8421C18.1299 11.8421 18.2286 11.8618 18.3206 11.9002C18.4126 11.9385 18.4961 11.9947 18.5663 12.0654L25.4824 18.9815L25.4748 23.2248Z"
                      fill="#727272"
                    />
                    <path
                      d="M7.54617 11.3333C6.79951 11.3333 6.06962 11.1119 5.44879 10.6971C4.82797 10.2822 4.3441 9.69264 4.05837 9.00282C3.77263 8.313 3.69787 7.55394 3.84354 6.82163C3.9892 6.08932 4.34875 5.41665 4.87672 4.88868C5.40469 4.36072 6.07736 4.00117 6.80967 3.8555C7.54198 3.70983 8.30104 3.78459 8.99086 4.07033C9.68068 4.35606 10.2703 4.83993 10.6851 5.46076C11.0999 6.08158 11.3213 6.81147 11.3213 7.55813C11.3213 8.55936 10.9236 9.51959 10.2156 10.2276C9.50763 10.9356 8.5474 11.3333 7.54617 11.3333ZM7.54617 5.29303C7.09817 5.29303 6.66024 5.42587 6.28774 5.67477C5.91525 5.92366 5.62493 6.27742 5.45349 6.69131C5.28205 7.1052 5.23719 7.56064 5.32459 8.00003C5.41199 8.43941 5.62772 8.84302 5.9445 9.1598C6.26128 9.47658 6.66488 9.69231 7.10427 9.77971C7.54365 9.8671 7.99909 9.82225 8.41298 9.65081C8.82688 9.47937 9.18063 9.18904 9.42953 8.81655C9.67842 8.44406 9.81127 8.00612 9.81127 7.55813C9.81127 6.95739 9.57262 6.38125 9.14783 5.95646C8.72305 5.53167 8.14691 5.29303 7.54617 5.29303Z"
                      fill="#727272"
                    />
                  </svg>
                )}
              </div>
            </label>

            <div id="image-requirements" className="ml-4">
              <p className="mt-0.5 text-sm text-gray-500">
                사진 크기: <span className="text-black">180x180px 이하</span>
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                사진 용량: <span className="text-black">256MB 이하</span>
              </p>
              <p className="mt-0.5 text-sm text-[#D52E7C]">
                법에 저촉되는 사진은 예술고등학교 없이 삭제될 수 있으며, 이에
                대해 책임을 지지 않습니다.
              </p>
            </div>
          </div>
        ) : selectedView === "article" ? (
          <TextareaAutosize
            className={`${textareaStyle}
              ${focusTarget && !article ? blankedWarningStyle : ""}`}
            placeholder="본문 내용 입력"
            value={article}
            onChange={handleArticleChange}
            ref={articleRef}
          />
        ) : null}
      </div>
    </div>
  );
};

const Footer = () => {
  const router = useRouter();

  const [questionTitle] = useAtom(questionTitleAtom);
  const [type] = useAtom(typeAtom);
  const [choiceDescriptions] = useAtom(choiceDescriptionAtom);
  const [correctAnswer] = useAtom(correctAnswerAtom);
  const [correctAnswerOX] = useAtom(correctAnswerOXAtom);
  const [selectedView] = useAtom(selectedViewAtom);
  const [article] = useAtom(articleAtom);
  const [explanation] = useAtom(explanationAtom);
  const [choiceExplanations] = useAtom(choiceExplanationAtom);
  const [preview] = useAtom(previewAtom);
  const [hint] = useAtom(hintAtom);
  const [guide] = useAtom(guideAtom);

  const [, setLoading] = useAtom(loadingAtom);
  const [, setFocusTarget] = useAtom(focusTargetAtom);
  const [, setInfoConfig] = useAtom(infoConfigState);
  const [, showPreview] = useAtom(showPreviewAtom);

  const [, resetAll] = useAtom(resetAllWroteItemsAtom);

  const isFilled = (): boolean => {
    const trigger = (target: string) => {
      setFocusTarget(`${target}-${Date.now()}`);
    };

    switch (true) {
      case questionTitle.trim() === "":
        trigger("questionTitle");
        return false;
      case type.value === "multiple-choice" &&
        (() => {
          const descriptions = [...choiceDescriptions.values()];

          const hasEmpty = descriptions.some(([desc]) => desc.trim() === "");

          const hasNoCorrect = !descriptions.some(
            ([, isCorrect]) => isCorrect === true,
          );

          return hasEmpty || hasNoCorrect;
        })():
        trigger("cDescription");
        return false;
      case type.value === "multiple-choice" &&
        ![...choiceExplanations.values()].some(
          (explanation) => explanation.trim() !== "",
        ) &&
        explanation.trim() === "":
        trigger("cExplanation");
        return false;
      case type.value !== "multiple-choice" && explanation.trim() === "":
        trigger("explanation");
        return false;
      case type.value === "text-input" && correctAnswer.trim() === "":
        trigger("correctAnswer");
        return false;
      case type.value === "ox" && correctAnswerOX === null:
        trigger("correctAnswerOX");
        return false;
      case selectedView === "image" && !preview:
        trigger("preview");
        return false;
      case selectedView === "article" && article.trim() === "":
        trigger("article");
        return false;
      default:
        break;
    }

    return true;
  };

  const requestCreateQuiz = async () => {
    if (!isFilled()) return;

    const getCorrectAnswer = () => {
      setLoading(true);

      const handlers = {
        "text-input": () => correctAnswer,
        ox: () => correctAnswerOX,
        "multiple-choice": () => {
          const entries = Array.from(choiceDescriptions.values());
          const correctIdx = entries.findIndex(([_, isCorrect]) => isCorrect);

          return String(correctIdx + 1);
        },
      };

      const handler = handlers[type.value as keyof typeof handlers];
      return handler ? handler() : undefined;
    };

    try {
      if (selectedView === "image" && preview) {
        setInfoConfig({
          content: "사진은 현재 지원되지 않습니다.",
          onClose: () => {
            setInfoConfig(null);
          },
        });
        return;
      }

      const quizData = {
        question: questionTitle,
        type: type.value,
        options: Array.from(choiceDescriptions.entries()).map(
          ([, [description]]) => ({ description }),
        ),
        rationale: Array.from(choiceExplanations.values()),
        correctAnswer: getCorrectAnswer(),
        commentary: explanation.trim() === "" ? null : explanation,
        hint: hint.trim() === "" ? null : hint,
        tag: ["실험용"],
        guide: guide,
        article: article.trim() === "" ? null : article,
      };

      await addDoc(collection(db, "requested"), quizData);

      setInfoConfig({
        content: "요청이 완료되었습니다!",
        onClose: () => {
          router.push("/quiz");
          resetAll();
          setInfoConfig(null);
        },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      setInfoConfig({
        content: "요청 중 오류가 발생했습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const openPreview = () => {
    if (!isFilled()) return;

    showPreview(true);
  };

  return (
    <div className="w-full h-[10%] flex items-center justify-center">
      <div className="w-[90%] flex">
        <button
          className="flex-1 px-4 py-2 bg-transparent
      border border-[#727272] rounded-md mr-2
      text-[#727272]"
          onClick={requestCreateQuiz}
        >
          생성 요청
        </button>
        <button
          className="flex-1 px-4 py-2 bg-transparent
      border border-[#727272] rounded-md
      text-[#727272]"
          onClick={openPreview}
        >
          미리 보기
        </button>
      </div>
    </div>
  );
};

export default function MakeQuiz() {
  const [user] = useAtom(userAtom);
  const [, setLoginConfig] = useAtom(loginConfigState);

  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      setLoginConfig({
        onClose: () => {
          router.back();
          setLoginConfig(null);
        },
      });
    }
  }, [user]);

  const [loading] = useAtom(loadingAtom);

  if (!user) return;

  return (
    <div className="relative w-full h-full">
      <Preview />
      {loading && (
        <div
          className="absolute w-full h-full bg-black opacity-50
        flex items-center justify-center
        z-1"
        >
          <p className="text-white text-3xl z-9999">로딩 중...</p>
        </div>
      )}
      <Header />
      <Section />
      <Footer />
    </div>
  );
}
