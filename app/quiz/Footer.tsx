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

const QuizFooter = styled.div<{ $started: boolean }>`
  width: 100%;
  height: 10%;

  display: ${({ $started }) => ($started ? "flex" : "none")};
  justify-content: center;
  align-items: flex-end;
`;

const Button = styled.button`
  background-color: transparent;

  width: 30%;
  height: 40px;

  margin-right: 10px;
  margin-bottom: 15px;

  border: 1px solid #000;
  border-radius: 5px;

  font-size: 16px;
`;

const HintButton = styled(Button)`
  width: 100%;
  height: 100%;

  margin: none;
`;

const HintContainer = styled.div`
  position: relative;
  width: 30%;
  height: 40px;

  margin-right: 10px;
  margin-bottom: 15px;
`;

const HintContent = styled.div`
  position: absolute;
  top: -40px;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const HintCount = styled.p`
  margin-left: 5px;
`;

const AnswerButton = styled(Button)``;

export default function Footer() {
  const [, setAlertConfig] = useAtom(confirmConfigState);
  const [, setInfoConfig] = useAtom(infoConfigState);
  const [hintCount, setHintCount] = useAtom(hintCountState);
  const [viewedQuiz, setViewedQuiz] = useAtom(viewedQuizState);
  const [, setQuestion] = useAtom(questionState);
  const [hint] = useAtom(hintState);
  const [answer] = useAtom(answerState);
  const [started] = useAtom(startedState);
  const [, setShowResult] = useAtom(showResultState);

  const handleShowHint = () => {
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

  const handleAnswerCheck = () => {
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
        },
        onCancel: () => {
          setAlertConfig(null);
        },
      });
    }
  };

  const handlePassCheck = () => {
    setAlertConfig({
      type: "danger",
      content: `정말로 넘기시겠습니까?
기존에 작업한 내용은 저장되지 않습니다!`,
      onConfirm: () => {
        setQuestion(selectQuestion(viewedQuiz, setViewedQuiz));
        setAlertConfig(null);
      },
      onCancel: () => {
        setAlertConfig(null);
      },
    });
  };

  const handleHintCheck = () => {
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
          handleShowHint();
          setAlertConfig(null);
        },
        onCancel: () => {
          setAlertConfig(null);
        },
      });
    }
  };

  return (
    <QuizFooter $started={started}>
      <HintContainer>
        <HintContent>
          <Clue />
          <HintCount>{hintCount}</HintCount>
        </HintContent>
        <HintButton onClick={handleHintCheck}>힌트</HintButton>
      </HintContainer>
      <AnswerButton onClick={handleAnswerCheck}>정답 확인</AnswerButton>
      <Button onClick={handlePassCheck}>넘기기</Button>
    </QuizFooter>
  );
}
