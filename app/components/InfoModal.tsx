"use client";

import { useAtom } from "jotai";
import { styled } from "styled-components";
import { infoConfigState } from "../atom/quizAtom";
import Image from "next/image";
import { Close } from "@/public/svgs/ListSVG";

// Quiz.tsx (또는 별도 Modal 컴포넌트)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  pointer-events: auto !important;
`;

const ModalContent = styled.div`
  position: relative;

  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  /* RN 변환을 위해 그림자 스타일도 미리 넣어두면 좋습니다 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalCloseButton = styled.button`
  background-color: transparent;

  position: absolute;
  top: 12px;
  right: 10px;

  width: 50px;
  height: 50px;

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled.div`
  margin-top: 5px;
  margin-left: 5px;
`;

const ContentText = styled.p`
  margin: 0 20px;
  margin-top: 30px;

  color: #333;
  font-size: 20px;
  text-align: center;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  background-color: transparent;
  padding: 11px 20px;
  border: 1px solid #333;
  border-radius: 5px;
  font-size: 16px;
`;

export default function InfoModal() {
  const [infoModalProps] = useAtom(infoConfigState);

  if (!infoModalProps) return null;

  return (
    <ModalOverlay
      onClick={(e) => {
        e.stopPropagation();
        infoModalProps.onClose();
      }}
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={() => infoModalProps.onClose()}>
          <Close />
        </ModalCloseButton>

        <LogoContainer>
          <Image
            src="/images/logo/Logo.png"
            alt="평명"
            width={67}
            height={27}
            style={{ objectFit: "contain" }}
            priority
          />
        </LogoContainer>

        <ContentText>{infoModalProps.content}</ContentText>

        <ButtonContainer>
          <Button onClick={() => infoModalProps.onClose()}>확인</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
