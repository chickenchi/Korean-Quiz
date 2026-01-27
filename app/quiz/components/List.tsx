"use client";

import { infoConfigState } from "@/app/atom/modalAtom";
import {
  listOpenState,
  showResultState,
  startedState,
} from "@/app/atom/quizAtom";
import { userAtom } from "@/app/atom/userAtom";
import {
  Approve,
  Bookmark,
  Category,
  Close,
  Help,
  MakeQuizIcon,
} from "@/public/svgs/ListSVG";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";

export default function List() {
  const [listOpen, setListOpen] = useAtom(listOpenState);
  const [showResult] = useAtom(showResultState);
  const [, setStarted] = useAtom(startedState);
  const [, setInfoConfig] = useAtom(infoConfigState);

  const [user] = useAtom(userAtom);

  const listClosing = () => {
    setListOpen(false);
    if (!showResult) setStarted(true);
  };

  const showComingSoonModal = () => {
    setInfoConfig({
      content: "추후에 구현될 예정입니다.",
      onClose: () => setInfoConfig(null),
    });
  };

  const linkButtonStyle = `flex items-center mr-[15px] mb-8 bg-transparent border-none group`;
  const linkTextStyle = `text-[13pt] font-normal text-black mr-3 group-active:text-gray-400`;

  return (
    <AnimatePresence>
      {listOpen && (
        /* QuizList: Overlay 배경 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex flex-col z-[100]"
          onClick={listClosing} // 배경 클릭 시 닫기 추가 (사용성)
        >
          {/* ListContainer: 사이드바 본체 */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-[35%] h-full bg-white flex flex-col items-end shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
          >
            {/* ListCloseButton */}
            <button
              onClick={listClosing}
              className="w-[50px] h-[50px] flex justify-center items-center bg-transparent border-none text-black active:opacity-50"
            >
              <Close />
            </button>

            {/* ListButtonContainer */}
            <div className="w-full mt-5 flex flex-col items-end justify-start">
              <button onClick={showComingSoonModal} className={linkButtonStyle}>
                <span className={linkTextStyle}>북마크</span>
                <Bookmark />
              </button>

              <button onClick={showComingSoonModal} className={linkButtonStyle}>
                <span className={linkTextStyle}>카테고리</span>
                <Category />
              </button>

              <button onClick={showComingSoonModal} className={linkButtonStyle}>
                <span className={linkTextStyle}>도움말</span>
                <Help />
              </button>

              <Link href="make_quiz" className="no-underline">
                <div className={linkButtonStyle}>
                  <span className={linkTextStyle}>문제 추가</span>
                  <MakeQuizIcon />
                </div>
              </Link>

              {user?.role === "admin" && (
                <Link href="requested_admin" className="no-underline">
                  <div className={linkButtonStyle}>
                    <span className={linkTextStyle}>문제 승인</span>
                    <Approve />
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
