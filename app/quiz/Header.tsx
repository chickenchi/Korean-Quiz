"use client";

import styled from "styled-components";
import Image from "next/image";
import { ListIcon, PauseIcon, PlayIcon } from "@/public/svgs/HeaderSVG";
import { useEffect, useState } from "react";
import { formatTime } from "./tools/format_time";
import { listOpenState, startedState, timeState } from "../atom/quizAtom";
import { useAtom } from "jotai";

const QuizHeader = styled.div`
  width: 100%;
  height: 10%;

  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  width: 25%;
`;

const Logo = styled.div`
  position: relative;

  margin-left: 15px;
`;

const TimeContainer = styled.div`
  width: 55%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Time = styled.p`
  font-size: 15pt;
  font-family: "Cafe24OnePrettyNight";
`;

const TimeControl = styled.div`
  display: flex;
  align-items: center;

  margin-left: 10px;
`;

const ListContainer = styled.div`
  width: 20%;

  display: flex;
  justify-content: flex-end;
`;

const ListButton = styled.button`
  background-color: transparent;

  width: 40px;
  height: 40px;

  margin-right: 15px;

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Header() {
  const [time, setTime] = useAtom(timeState);
  const [started, setStarted] = useAtom(startedState);
  const [, setListOpen] = useAtom(listOpenState);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [started]);

  const listOpening = () => {
    setListOpen(true);
    setStarted(false);
  };

  return (
    <QuizHeader>
      <LogoContainer>
        <Logo>
          <Image
            src="/assets/images/logo/Logo.png"
            alt="평명"
            width={80}
            height={30}
            style={{ objectFit: "contain" }}
            priority
          />
        </Logo>
      </LogoContainer>
      <TimeContainer>
        <Time>{formatTime(time)}</Time>
        <TimeControl onClick={() => setStarted(!started)}>
          {started ? <PauseIcon /> : <PlayIcon />}
        </TimeControl>
      </TimeContainer>
      <ListContainer>
        <ListButton onClick={() => listOpening()}>
          <ListIcon />
        </ListButton>
      </ListContainer>
    </QuizHeader>
  );
}
