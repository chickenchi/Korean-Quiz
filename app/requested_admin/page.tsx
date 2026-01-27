"use client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { db } from "../lib/client";
import { infoConfigState } from "../atom/quizAtom";
import { Back } from "@/public/svgs/CategorySVG";
import { ParsedText } from "../components/ParsedText";
import { useRouter } from "next/navigation";

export interface questionData {
  id: string;
  questionNumber: number;
  question: string;
  type: "multiple-choice" | "text-input" | "ox";
  options?: { description: string }[];
  rationale?: string[];
  correctAnswer: number | string;
  commentary?: string;
  hint?: string;
  tag: string[];
  guide?: string;
  article?: string;
  image?: any;
}

const Header = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-[15%] flex items-center justify-center">
      <button
        className="absolute right-6 top-6"
        onClick={() => router.replace("/quiz")}
      >
        <Back />
      </button>
      <h1 className="text-3xl">요청 현황</h1>
    </div>
  );
};

const Section = () => {
  const [requestedQuizList, setRequestedQuizList] = useState<
    questionData[] | null
  >(null);
  const [, setInfoConfig] = useAtom(infoConfigState);

  useEffect(() => {
    const col = collection(db, "requested");

    const unsubscribe = onSnapshot(col, (snapshot) => {
      const rQL = snapshot.docs.map((doc) => ({
        ...(doc.data() as questionData),
        id: doc.id,
      }));

      setRequestedQuizList(rQL);
    });

    return () => unsubscribe();
  }, []);

  const approveRequest = async (id: string) => {
    try {
      const targetQuiz = requestedQuizList?.find((quiz) => quiz.id === id);
      if (!targetQuiz) return;

      await addDoc(collection(db, "question"), {
        ...targetQuiz,
        approvedAt: Date.now(),
      });

      await deleteDoc(doc(db, "requested", id));

      setInfoConfig({
        content: "퀴즈가 정식 등록되었습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } catch (error) {
      console.error("승인 중 에러 발생:", error);
      setInfoConfig({
        content: "승인 중 문제가 발생했습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    }
  };

  return (
    <div
      className="w-full h-[75%] overflow-y-auto
    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {requestedQuizList ? (
        <div>
          {requestedQuizList.map((data, index) => (
            <div
              key={index}
              className="relative w-[90%] ml-4 mb-3 px-4 py-3
              border border-[#727272] rounded"
            >
              <div key={data.id} className="w-[90%] flex flex-row gap-1">
                <div className="truncate min-w-0">
                  <ParsedText text={data.question} />
                </div>
              </div>
              <button
                className="p-1 px-2
            absolute right-3 bottom-1/2 translate-y-1/2
            text-[#727272]
            border border-[#727272] rounded"
                onClick={() => approveRequest(data.id)}
              >
                승인
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="ml-4">불러오는 중...</div>
      )}
    </div>
  );
};

const Footer = () => {
  return <div></div>;
};

export default function RequestedAdmin() {
  const router = useRouter();
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const password = prompt("관리자 암호를 입력하세요");

    if (password !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
      alert("어딜 감히 ㅎㅎ");
      router.replace("/");
    } else {
      setLocked(false);
    }
  }, []);

  if (locked) return;

  return (
    <div className="w-full h-full">
      <Header />
      <Section />
      <Footer />
    </div>
  );
}
