"use client";

import Header from "./Header";
import Section from "./Section";
import Footer from "./Footer";
import List from "./components/List";
import QuizView from "../components/common/view/View";
import { answerState, questionState } from "../atom/quizAtom";
import { useAtom } from "jotai";
import ExplanationSheet from "@/app/components/common/explanation_sheet/ExplanationSheet";

export default function Quiz() {
  const [question] = useAtom(questionState);
  const [answer] = useAtom(answerState);

  return (
    <div className="relative w-full h-full bg-white">
      <Header />
      <>
        <Section />
        <Footer />
      </>
      <List />
      <QuizView
        article={question?.article ?? undefined}
        image={question?.image ?? undefined}
      />
      <ExplanationSheet
        commentary={question?.commentary}
        rationale={question?.rationale}
        correctAnswer={String(question?.correctAnswer)}
        answer={answer}
      />
    </div>
  );
}
