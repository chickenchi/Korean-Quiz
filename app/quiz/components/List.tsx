"use client";

import { listOpenState } from "@/app/atom/quizAtom";
import { Bookmark, Category, Close, Help } from "@/public/svgs/ListSVG";
import { useAtom } from "jotai";
import styled from "styled-components";

const QuizList = styled.div`
  background-color: rgba(0, 0, 0, 0.5);

  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  z-index: 1;
`;

const ListContainer = styled.div`
  background-color: white;

  position: absolute;
  top: 0;
  right: 0;

  width: 35%;
  height: 100%;

  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

const ListCloseButton = styled.button`
  background-color: transparent;

  width: 50px;
  height: 50px;

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListButtonContainer = styled.div`
  width: 100%;

  margin-top: 20px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: column;
`;

const ListButton = styled.button`
  background-color: transparent;
  border: none;

  display: flex;
  align-items: center;

  margin-right: 15px;
`;

const ListButtonText = styled.p`
  font-size: 13pt;
  font-weight: 400;
  color: black;

  margin-right: 12px;
`;

export default function List() {
  const [listOpen, setListOpen] = useAtom(listOpenState);

  if (!listOpen) {
    return null;
  }

  return (
    <QuizList>
      <ListContainer>
        <ListCloseButton onClick={() => setListOpen(!listOpen)}>
          <Close />
        </ListCloseButton>

        <ListButtonContainer>
          <ListButton>
            <ListButtonText>북마크</ListButtonText>
            <Bookmark />
          </ListButton>

          <ListButton>
            <ListButtonText>카테고리</ListButtonText>
            <Category />
          </ListButton>

          <ListButton>
            <ListButtonText>도움말</ListButtonText>
            <Help />
          </ListButton>
        </ListButtonContainer>
      </ListContainer>
    </QuizList>
  );
}
