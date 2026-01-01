"use client";

import styled from "styled-components";
import Header from "./Header";
import Section from "./Section";
import Footer from "./Footer";
import List from "./components/List";
import { useAtom } from "jotai";
import { startedState } from "../atom/quizAtom";

const QuizBackground = styled.div`
  position: relative;
  background-color: white;
  width: 100vw;
  height: 100vh;
`;

export default function Quiz() {
  const [started, setStarted] = useAtom(startedState);

  return (
    <QuizBackground>
      <Header />
      {started && (
        <>
          <Section />
          <Footer />
        </>
      )}
      <List />
    </QuizBackground>
  );
}
