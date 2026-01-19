"use client";

import styled from "styled-components";
import {
  answerState,
  confirmConfigState,
  hintCountState,
  hintState,
  infoConfigState,
  questionState,
  showResultState,
  startedState,
  viewedQuizState,
} from "../atom/quizAtom";
import { useAtom } from "jotai";
import { selectQuestion } from "./tools/select_question";
import { Clue } from "@/public/svgs/QuizSVG";

const QuizFooter = styled.div<{ $started: boolean; $showResult: boolean }>`
  position: relative;

  width: 100%;
  height: 10%;

  display: ${({ $started, $showResult }) =>
    $started || $showResult ? "block" : "none"};
  justify-content: center;
  align-items: flex-end;
`;

const Button = styled.button`
  position: absolute;
  bottom: 15px;

  background-color: transparent;

  width: 25%;
  height: 40px;

  border: 1px solid #000;
  border-radius: 5px;

  font-size: 16px;
`;

const SkipButton = styled(Button)`
  right: 10px;
`;

const HintContainer = styled.div`
  position: absolute;
  left: 10px;
  bottom: 0;

  width: 25%;
  height: 40px;
`;

const HintButton = styled(Button)`
  position: relative;

  width: 100%;
  height: 100%;

  margin: none;
`;

const HintContent = styled.div`
  position: absolute;
  top: -55px;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const HintCount = styled.p`
  margin-left: 5px;
`;

const AnswerButton = styled(Button)`
  right: 50%;

  width: 40%;

  transform: translate(50%, 0%);
`;

const NextButton = styled(Button)`
  background-color: #e04e92;

  left: 10px;

  width: 45%;

  color: white;
`;

const ExplanationButton = styled(Button)`
  right: 10px;

  width: 45%;
`;

export default function Footer() {
  const [hintCount, setHintCount] = useAtom(hintCountState);
  const [showResult, setShowResult] = useAtom(showResultState);

  const [hint] = useAtom(hintState);
  const [answer] = useAtom(answerState);
  const [started, setStarted] = useAtom(startedState);

  const [, setAlertConfig] = useAtom(confirmConfigState);
  const [, setInfoConfig] = useAtom(infoConfigState);
  const [, setQuestion] = useAtom(questionState);

  const showHint = () => {
    if (!hint) {
      setInfoConfig({
        content: "힌트가 없습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } else {
      setHintCount(hintCount - 1);

      setInfoConfig({
        content: hint,
        onClose: () => {
          setInfoConfig(null);
        },
      });
    }
  };

  const answerCheck = () => {
    if (!answer) {
      setInfoConfig({
        content: "정답을 입력하거나 고르세요.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } else {
      setAlertConfig({
        content: "정말로 정답을 확인하시겠습니까?",
        onConfirm: () => {
          setAlertConfig(null);
          setShowResult(true);
          setStarted(false);
        },
        onCancel: () => {
          setAlertConfig(null);
        },
      });
    }
  };

  const passCheck = () => {
    setAlertConfig({
      type: "danger",
      content: `정말로 넘기시겠습니까?
기존에 작업한 내용은 저장되지 않습니다!`,
      onConfirm: () => {
        setQuestion(selectQuestion());
        setAlertConfig(null);
      },
      onCancel: () => {
        setAlertConfig(null);
      },
    });
  };

  const hintCheck = () => {
    if (hintCount <= 0) {
      setInfoConfig({
        content: "사용 가능한 힌트가 없습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } else {
      setAlertConfig({
        content: `정말로 힌트를 사용하시겠습니까?
현재 볼 수 있는 힌트는 ${hintCount}개입니다.`,
        onConfirm: () => {
          showHint();
          setAlertConfig(null);
        },
        onCancel: () => {
          setAlertConfig(null);
        },
      });
    }
  };

  const nextQuiz = () => {
    setShowResult(false);
    setStarted(true);
    setQuestion(selectQuestion());
  };

  const explanation = () => {};

  return (
    <QuizFooter $started={started} $showResult={showResult}>
      {!showResult ? (
        <>
          <HintContainer>
            <HintContent>
              <Clue />
              <HintCount>{hintCount}</HintCount>
            </HintContent>
            <HintButton onClick={hintCheck}>힌트</HintButton>
          </HintContainer>
          <AnswerButton onClick={answerCheck}>정답 확인</AnswerButton>
          <SkipButton onClick={passCheck}>넘기기</SkipButton>
        </>
      ) : (
        <>
          <NextButton onClick={nextQuiz}>다음 문제</NextButton>
          <ExplanationButton onClick={explanation}>해설</ExplanationButton>
        </>
      )}
    </QuizFooter>
  );
}
