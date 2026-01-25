"use client";

import {
  infoConfigState,
  listOpenState,
  showResultState,
  startedState,
} from "@/app/atom/quizAtom";
import {
  Bookmark,
  Category,
  Close,
  Help,
  MakeQuizIcon,
} from "@/public/svgs/ListSVG";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import Link from "next/link";
import styled from "styled-components";

const QuizList = styled(motion.div)`
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

const ListContainer = styled(motion.div)`
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
  margin-bottom: 5px;
`;

const ListButtonLink = styled(Link)`
  text-decoration: none;
`;

const ListButtonText = styled.p`
  font-size: 13pt;
  font-weight: 400;
  color: black;

  margin-right: 12px;
`;

export default function List() {
  const [listOpen, setListOpen] = useAtom(listOpenState);

  const [showResult] = useAtom(showResultState);

  const [, setStarted] = useAtom(startedState);
  const [, setInfoConfig] = useAtom(infoConfigState);

  const listClosing = () => {
    setListOpen(false);
    if (!showResult) setStarted(true);
  };

  const showComingSoonModal = () => {
    setInfoConfig({
      content: "추후에 구현될 예정입니다.",
      onClose: () => {
        setInfoConfig(null);
      },
    });
  };

  return (
    <AnimatePresence>
      {listOpen && (
        <QuizList
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ListContainer
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <ListCloseButton onClick={() => listClosing()}>
              <Close />
            </ListCloseButton>

            <ListButtonContainer>
              <ListButton>
                <ListButtonText onClick={showComingSoonModal}>
                  북마크
                </ListButtonText>
                <Bookmark />
              </ListButton>

              <ListButton>
                <ListButtonText onClick={showComingSoonModal}>
                  카테고리
                </ListButtonText>
                <Category />
              </ListButton>

              <ListButton>
                <ListButtonText onClick={showComingSoonModal}>
                  도움말
                </ListButtonText>
                <Help />
              </ListButton>

              <ListButtonLink href="make_quiz">
                <ListButton>
                  <ListButtonText>문제 추가</ListButtonText>
                  <MakeQuizIcon />
                </ListButton>
              </ListButtonLink>
            </ListButtonContainer>
          </ListContainer>
        </QuizList>
      )}
    </AnimatePresence>
  );
}
