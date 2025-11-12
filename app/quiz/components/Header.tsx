"use client";

import styled from "styled-components";
import Image from "next/image";
import { List, Pause, Play } from "@/public/svgs/HeaderSVG";
import { useState } from "react";

const QuizHeader = styled.div`
  width: 100%;
  height: 10%;

  display: flex;
  align-items: center;
`;

const LogoDiv = styled.div`
  width: 25%;
`;

const Logo = styled.div`
  position: relative;

  margin-left: 15px;
`;

const TimeDiv = styled.div`
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

const ListDiv = styled.div`
  width: 20%;

  display: flex;
  justify-content: flex-end;
`;

const ListButton = styled.button`
  background-color: rgba(0, 0, 0, 0);

  width: 40px;
  height: 40px;

  margin-right: 15px;

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Header() {
  const [played, setPlayed] = useState(true);

  return (
    <QuizHeader>
      <LogoDiv>
        <Logo>
          <Image
            src="/assets/images/logo/Logo.png"
            alt="평명"
            width={85}
            height={35}
            style={{ width: "85px", height: "35px", objectFit: "contain" }}
            priority
          />
        </Logo>
      </LogoDiv>
      <TimeDiv>
        <Time>00:00</Time>
        <TimeControl>
          {played && <Pause />}
          {!played && <Play />}
        </TimeControl>
      </TimeDiv>
      <ListDiv>
        <ListButton>
          <List />
        </ListButton>
      </ListDiv>
    </QuizHeader>
  );
}
