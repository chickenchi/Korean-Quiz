import { openExplanationSheetState } from "@/app/atom/quizAtom";
import { useAtom } from "jotai";
import styled from "styled-components";

import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { EllipsisText } from "./components/ellipsisText";
import InfoModal from "@/app/components/InfoModal";

const Overlay = styled(Drawer.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);

  z-index: 20;
`;

const Content = styled(Drawer.Content)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background: white;
  border-radius: 16px 16px 0 0;
  padding: 16px;

  z-index: 20;
`;

const AnswerComparison = styled.div`
  position: relative;
  width: 100%;
  height: 60px;

  display: flex;
  justify-content: center;
`;

const AnswerCard = styled.div`
  width: 45%;
  height: 50px;

  margin: 10px;

  border: 1px solid black;
  border-radius: 5px;

  display: flex;
  align-items: center;
`;

const AnswerTitle = styled.p`
  margin: 10px;

  font-size: 15pt;

  white-space: nowrap;
`;

const AnswerValue = styled.p`
  font-size: 14pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Title = styled.p`
  font-size: 19pt;

  padding: 0 10px;
`;

const Commentary = styled.p`
  font-size: 15pt;

  padding: 0 20px;
`;

const RationaleList = styled.div``;

const RationaleTitle = styled(Title)`
  font-size: 17pt;
`;

const RationaleBody = styled.div`
  margin: 0 10px;
`;

const RationaleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 0 10px;

  margin-bottom: 10px;
`;

const RationaleMarker = styled.p`
  margin: 0;
  margin-right: 5px;
`;

const RationaleText = styled.p`
  margin: 0;
`;

export default function ExplanationSheet({
  commentary,
  rationale,
  correctAnswer,
  answer,
}: {
  commentary?: string;
  rationale?: string[];
  correctAnswer: string;
  answer?: string;
}) {
  const [open, setOpen] = useAtom(openExplanationSheetState);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Overlay />
        <Content>
          <VisuallyHidden>
            <Drawer.Title>해설</Drawer.Title>
            <Drawer.Description>해설</Drawer.Description>
          </VisuallyHidden>

          <AnswerComparison>
            <AnswerCard>
              <AnswerTitle>정답</AnswerTitle>
              <AnswerValue>{correctAnswer}</AnswerValue>
            </AnswerCard>
            {answer && (
              <AnswerCard>
                <AnswerTitle>내 답</AnswerTitle>
                <EllipsisText text={answer} />
              </AnswerCard>
            )}
          </AnswerComparison>

          <Title>해설</Title>
          <Commentary>
            {commentary ?? "하단에 있는 오답 보기를 확인해 주세요!"}
          </Commentary>

          {rationale && rationale.some((item) => item?.trim()) && (
            <RationaleList>
              <RationaleTitle>선지별 설명</RationaleTitle>
              <RationaleBody>
                {rationale?.map((item, index) => (
                  <>
                    {item && (
                      <RationaleRow key={index}>
                        <RationaleMarker>
                          {String.fromCharCode(9312 + index)}
                        </RationaleMarker>
                        <RationaleText>{item}</RationaleText>
                      </RationaleRow>
                    )}
                  </>
                ))}
              </RationaleBody>
            </RationaleList>
          )}
        </Content>

        <InfoModal />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
