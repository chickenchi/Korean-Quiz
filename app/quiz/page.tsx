"use client";

import styled from "styled-components";
import Header from "./Header";
import Section from "./Section";
import Footer from "./Footer";
import List from "./components/List";
import { useAtom } from "jotai";
import { showResultState } from "../atom/quizAtom";
import ResultSection from "./ResultSection";
import ResultFooter from "../ResultFooter";

const QuizBackground = styled.div`
  position: relative;
  background-color: white;
  width: 100vw;
  height: 100vh;
`;

export default function Quiz() {
  const [showResult] = useAtom(showResultState);

  return (
    <QuizBackground>
      <Header />

      {!showResult ? (
        <>
          <Section />
          <Footer />
        </>
      ) : (
        <>
          <ResultSection />
          <ResultFooter />
        </>
      )}
      <List />
    </QuizBackground>
  );
}
