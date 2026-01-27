"use client";

import {
  answerState,
  hintCountState,
  hintState,
  openExplanationSheetState,
  questionState,
  showResultState,
  startedState,
} from "../atom/quizAtom";
import { useAtom } from "jotai";
import { selectQuestion } from "./tools/select_question";
import { Clue } from "@/public/svgs/QuizSVG";
import { confirmConfigState, infoConfigState } from "../atom/modalAtom";

export default function Footer() {
  const [hintCount, setHintCount] = useAtom(hintCountState);
  const [showResult, setShowResult] = useAtom(showResultState);
  const [, setOpenExplanationSheet] = useAtom(openExplanationSheetState);

  const [hint] = useAtom(hintState);
  const [answer] = useAtom(answerState);
  const [started, setStarted] = useAtom(startedState);

  const [, setAlertConfig] = useAtom(confirmConfigState);
  const [, setInfoConfig] = useAtom(infoConfigState);
  const [, setQuestion] = useAtom(questionState);

  // --- Logic Functions ---
  const showHint = () => {
    if (!hint) {
      setInfoConfig({
        content: "힌트가 없습니다.",
        onClose: () => setInfoConfig(null),
      });
    } else {
      setHintCount(hintCount - 1);
      setInfoConfig({
        content: hint,
        onClose: () => setInfoConfig(null),
      });
    }
  };

  const answerCheck = () => {
    if (!answer) {
      setInfoConfig({
        content: "정답을 입력하거나 고르세요.",
        onClose: () => setInfoConfig(null),
      });
    } else {
      setAlertConfig({
        content: "정말로 정답을 확인하시겠습니까?",
        onConfirm: () => {
          setAlertConfig(null);
          setShowResult(true);
          setStarted(false);
        },
        onCancel: () => setAlertConfig(null),
      });
    }
  };

  const passCheck = () => {
    setAlertConfig({
      type: "danger",
      content: `정말로 넘기시겠습니까?\n기존에 작업한 내용은 저장되지 않습니다!`,
      onConfirm: async () => {
        setQuestion(await selectQuestion());
        setAlertConfig(null);
      },
      onCancel: () => setAlertConfig(null),
    });
  };

  const hintCheck = () => {
    if (hintCount <= 0) {
      setInfoConfig({
        content: "사용 가능한 힌트가 없습니다.",
        onClose: () => setInfoConfig(null),
      });
    } else {
      setAlertConfig({
        content: `정말로 힌트를 사용하시겠습니까?\n현재 볼 수 있는 힌트는 ${hintCount}개입니다.`,
        onConfirm: () => {
          showHint();
          setAlertConfig(null);
        },
        onCancel: () => setAlertConfig(null),
      });
    }
  };

  const nextQuiz = async () => {
    setShowResult(false);
    setStarted(true);
    setQuestion(await selectQuestion());
  };

  const showExplanation = () => {
    setOpenExplanationSheet(true);
  };

  const buttonStyle = "flex-1 self-start py-2.5 b-4 border rounded text-xl";

  return (
    <footer
      className={`w-full h-[10%] flex items-center justify-center 
      ${started || showResult ? "flex" : "hidden"}`}
    >
      {!showResult ? (
        <div className="w-[90%] mb-2 flex gap-2">
          <div className="relative flex-1">
            <div className="absolute top-[-30px] left-0 w-full flex items-center justify-center space-x-1">
              <Clue />
              <span className="text-[14pt] tabular-nums font-medium">
                {hintCount}
              </span>
            </div>
            <button onClick={hintCheck} className={`${buttonStyle} w-full`}>
              힌트
            </button>
          </div>

          {/* 정답 확인 버튼 (중앙) */}
          <button onClick={answerCheck} className={`${buttonStyle} flex-2`}>
            정답 확인
          </button>

          {/* 넘기기 버튼 (우측) */}
          <button onClick={passCheck} className={buttonStyle}>
            넘기기
          </button>
        </div>
      ) : (
        <div className="w-[90%] mb-2 flex gap-2">
          {/* 다음 문제 버튼 (핑크 포인트) */}
          <button
            onClick={nextQuiz}
            className={`${buttonStyle} bg-[#e04e92] text-white`}
          >
            다음 문제
          </button>
          {/* 해설 버튼 */}
          <button onClick={showExplanation} className={buttonStyle}>
            해설
          </button>
        </div>
      )}
    </footer>
  );
}
