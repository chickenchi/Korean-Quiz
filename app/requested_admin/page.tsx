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
import {
  confirmConfigState,
  infoConfigState,
  inputConfigState,
  loginConfigState,
} from "../atom/modalAtom";
import { Back } from "@/public/svgs/CategorySVG";
import { ParsedText } from "../components/ParsedText";
import { useRouter } from "next/navigation";
import { RequestedPreview } from "./components/RequestedPreview";
import { previewConfigAtom } from "../atom/reqAdminAtom";
import { userAtom } from "../atom/userAtom";

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
  const [, setInputConfig] = useAtom(inputConfigState);
  const [, setConfirmConfig] = useAtom(confirmConfigState);
  const [, setPreviewConfig] = useAtom(previewConfigAtom);

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

  const reject = (id: string) => {
    setInputConfig({
      content: "사유",
      placeholder: "요청 거부 사유를 작성해 주세요.",
      onConfirm: (content) => {
        setInputConfig(null);

        setConfirmConfig({
          content: `거부 사유를 ${content ? `'${content}'라고 작성하셨습니다.` : "작성하지 않으셨습니다."}
부당 거부 시, 제재를 받을 수 있습니다!
계속하시겠습니까?`,
          onCancel: () => {
            setConfirmConfig(null);
            setInfoConfig({
              content: "취소되었습니다.",
              onClose: () => {
                setInfoConfig(null);
              },
            });
          },
          onConfirm: () => {
            setConfirmConfig(null);
            rejectRequest(id, content);
          },
        });
      },
      onCancel: () => {
        setInputConfig(null);
      },
    });
  };

  const rejectRequest = async (id: string, content: string) => {
    try {
      const targetQuiz = requestedQuizList?.find((quiz) => quiz.id === id);
      if (!targetQuiz) return;

      await addDoc(collection(db, "rejected"), {
        ...targetQuiz,
        rejectedAt: Date.now(),
        reason: content,
      });

      await deleteDoc(doc(db, "requested", id));

      setInfoConfig({
        content: "요청 거부가 완료되었습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    } catch (error) {
      console.error("거절 중 에러 발생:", error);
      setInfoConfig({
        content: "거절 중 문제가 발생했습니다.",
        onClose: () => {
          setInfoConfig(null);
        },
      });
    }
  };

  const buttonStyle = `p-1 px-2
            text-[#727272]
            border border-[#727272] rounded`;

  return (
    <div
      className="w-full h-[75%] overflow-y-auto
    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {requestedQuizList ? (
        <div className="w-full h-full">
          {requestedQuizList.map((data, index) => (
            <div
              key={index}
              role="button"
              className="relative w-[90%] ml-4 mb-3 px-4 py-3
              border border-[#727272] rounded"
              onClick={() =>
                setPreviewConfig({ id: data.id, questionType: "requested" })
              }
            >
              <div key={data.id} className="w-[70%]">
                <div className="truncate">
                  <ParsedText text={data.question} />
                </div>
              </div>

              <div className="absolute right-3 bottom-1/2 translate-y-1/2">
                <button
                  className={`${buttonStyle} mr-2`}
                  onClick={(e) => {
                    e.stopPropagation();
                    approveRequest(data.id);
                  }}
                >
                  승인
                </button>
                <button
                  className={buttonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    reject(data.id);
                  }}
                >
                  거부
                </button>
              </div>
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
  return <div className="relative"></div>;
};

export default function RequestedAdmin() {
  const router = useRouter();
  const [locked, setLocked] = useState(true);

  const [user] = useAtom(userAtom);
  const [, setLoginConfig] = useAtom(loginConfigState);
  const [, setInfoConfig] = useAtom(infoConfigState);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      setLoginConfig({
        onClose: () => {
          router.back();
          setLoginConfig(null);
        },
      });
    } else if (user.role !== "admin") {
      setInfoConfig({
        content: "일반 유저는 사용하실 수 없습니다.",
        onClose: () => {
          router.back();
          setInfoConfig(null);
        },
      });
    } else {
      setLocked(false);
    }
  }, [user]);

  if (locked) return;

  return (
    <div className="relative w-full h-full">
      <Header />
      <Section />
      <Footer />
      <RequestedPreview />
    </div>
  );
}
