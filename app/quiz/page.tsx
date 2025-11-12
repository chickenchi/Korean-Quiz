"use client";

import styled from "styled-components";
import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";

const QuizBackground = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
`;

export default function Quiz() {
  return (
    <QuizBackground>
      <Header />
      <Section />
      <Footer />
    </QuizBackground>
  );
}
