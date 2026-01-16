// import { useAtom } from "jotai";
// import { useEffect, useState, useRef } from "react";
// import styled from "styled-components";
// import { showResultState } from "./atom/quizAtom";

// const ResultQuizFooter = styled.div`
//   width: 100%;
//   height: 10%;

//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
// `;

// const Button = styled.button`
//   background-color: transparent;

//   width: 30%;
//   height: 40px;

//   margin-right: 10px;
//   margin-bottom: 15px;

//   border: 1px solid #000;
//   border-radius: 5px;

//   font-size: 16px;
// `;

// export default function ResultFooter() {
//   const [, setShowResult] = useAtom(showResultState);
//   /* const [, ] = useState();

//     useEffect(() => {

//     }, [])

//     const content = useRef();

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         ()
//     } */

//   const handleNextQuiz = () => {
//     setShowResult(false);

//   };

//   return (
//     <ResultQuizFooter $started={started}>
//       <HintButton onClick={handleHintCheck}>힌트</HintButton>
//       <AnswerButton onClick={handleNextQuiz}>다음 문제</AnswerButton>
//       <Button onClick={handlePassCheck}>넘기기</Button>
//     </ResultQuizFooter>
//   );
// }
