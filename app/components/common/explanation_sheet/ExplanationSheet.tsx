"use client";

import { openExplanationSheetState } from "@/app/atom/quizAtom";
import { useAtom } from "jotai";
import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { EllipsisText } from "./components/ellipsisText";
import InfoModal from "@/app/components/common/modal/info_modal/InfoModal";

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
        {/* Overlay: rgba(0, 0, 0, 0.4)는 bg-black/40으로 컷 */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-20" />

        {/* Content: 하단 고정 서랍 레이아웃 */}
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-4 z-20 outline-none">
          <VisuallyHidden>
            <Drawer.Title>해설</Drawer.Title>
            <Drawer.Description>해설 내용입니다.</Drawer.Description>
          </VisuallyHidden>

          {/* AnswerComparison: 정답 vs 내 답 비교 섹션 */}
          <div className="relative w-full h-[60px] flex justify-center mb-4">
            <div className="w-[45%] h-[50px] m-[10px] border border-black rounded-[5px] flex items-center px-2">
              <p className="m-[10px] text-[15pt] whitespace-nowrap font-normal">
                정답
              </p>
              <p className="text-[14pt] whitespace-nowrap overflow-hidden text-ellipsis font-normal">
                {correctAnswer}
              </p>
            </div>

            {answer && (
              <div className="w-[45%] h-[50px] m-[10px] border border-black rounded-[5px] flex items-center px-2">
                <p className="m-[10px] text-[15pt] whitespace-nowrap font-normal">
                  내 답
                </p>
                <div className="overflow-hidden">
                  <EllipsisText text={answer} />
                </div>
              </div>
            )}
          </div>

          {/* 메인 해설 섹션 */}
          <h2 className="text-[19pt] px-[10px] font-normal">해설</h2>
          <p className="text-[15pt] px-5 mt-2 font-normal leading-relaxed whitespace-pre-wrap">
            {commentary ?? "하단에 있는 오답 보기를 확인해 주세요!"}
          </p>

          {/* RationaleList: 선지별 상세 설명 */}
          {rationale && rationale.some((item) => item?.trim()) && (
            <div className="mt-6">
              <h3 className="text-[17pt] px-[10px] font-normal">선지별 설명</h3>
              <div className="mx-[10px] mt-3">
                {rationale.map(
                  (item, index) =>
                    item && (
                      <div
                        key={index}
                        className="flex items-start justify-start px-[10px] mb-[10px]"
                      >
                        <span className="mr-[5px] shrink-0 font-normal">
                          {String.fromCharCode(9312 + index)}
                        </span>
                        <p className="m-0 text-[14pt] font-normal leading-snug">
                          {item}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
        </Drawer.Content>

        <InfoModal />
      </Drawer.Portal>
    </Drawer.Root>
  );
}
