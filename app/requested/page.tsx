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
  loginConfigState,
} from "../atom/modalAtom";
import { Back } from "@/public/svgs/CategorySVG";
import { ParsedText } from "../components/ParsedText";
import { useRouter } from "next/navigation";
import { RequestedPreview } from "@/app/components/requested/requested_preview/RequestedPreview";
import { previewConfigAtom } from "../atom/reqAdminAtom";
import { userAtom, UserState } from "../atom/userAtom";
import {
  articleAtom,
  choiceDescriptionAtom,
  choiceExplanationAtom,
  correctAnswerAtom,
  correctAnswerOXAtom,
  explanationAtom,
  focusTargetAtom,
  guideAtom,
  hintAtom,
  previewAtom,
  questionTitleAtom,
  quizIdAtom,
  selectedViewAtom,
  typeAtom,
  typeOptions,
} from "../atom/makeQuizAtom";

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
  author: string;
  reason?: string;
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
      <h1 className="text-3xl">요청 문제</h1>
    </div>
  );
};

const Section = ({ user }: { user: UserState }) => {
  const [requestedQuizList, setRequestedQuizList] = useState<
    questionData[] | null
  >(null);
  const [quizList, setQuizList] = useState<questionData[] | null>(null);
  const [rejectedQuizList, setRejectedQuizList] = useState<
    questionData[] | null
  >(null);

  const [, setQuestionTitle] = useAtom(questionTitleAtom);
  const [, setType] = useAtom(typeAtom);
  const [, setChoiceDescriptions] = useAtom(choiceDescriptionAtom);
  const [, setChoiceExplanations] = useAtom(choiceExplanationAtom);
  const [, setCorrectAnswer] = useAtom(correctAnswerAtom);
  const [, setCorrectAnswerOX] = useAtom(correctAnswerOXAtom);
  const [, setSelectedView] = useAtom(selectedViewAtom);
  const [, setArticle] = useAtom(articleAtom);
  const [, setExplanation] = useAtom(explanationAtom);
  const [, setPreview] = useAtom(previewAtom);
  const [, setHint] = useAtom(hintAtom);
  const [, setGuide] = useAtom(guideAtom);
  const [, setFocusTarget] = useAtom(focusTargetAtom);

  const [, setPreviewConfig] = useAtom(previewConfigAtom);

  const [, setInfoConfig] = useAtom(infoConfigState);
  const [, setConfirmConfig] = useAtom(confirmConfigState);

  const [, setQuizId] = useAtom(quizIdAtom);

  const router = useRouter();

  useEffect(() => {
    const reqCol = collection(db, "requested");

    const unsub = onSnapshot(reqCol, (snapshot) => {
      const rQL = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as questionData),
          id: doc.id,
        }))
        .filter((item) => item.author === user.uid);

      setRequestedQuizList(rQL);
    });

    const questionCol = collection(db, "question");

    const unsub2 = onSnapshot(questionCol, (snapshot) => {
      const qQL = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as questionData),
          id: doc.id,
        }))
        .filter((item) => item.author === user.uid);

      setQuizList(qQL);
    });

    const rejectCol = collection(db, "rejected");

    const unsub3 = onSnapshot(rejectCol, (snapshot) => {
      const qQL = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as questionData),
          id: doc.id,
        }))
        .filter((item) => item.author === user.uid);

      setRejectedQuizList(qQL);
    });

    return () => {
      unsub();
      unsub2();
      unsub3();
    };
  }, []);

  const readRejectedReason = (reason: string) => {
    setInfoConfig({
      content: `${reason || "거부 사유가 없습니다."}
부당 거부로 판단되는 경우 담당자에게 연락하시기 바랍니다.`,
      onClose: () => {
        setInfoConfig(null);
      },
    });
  };

  const edit = (data: questionData) => {
    const type = data.type;

    const selectedType = typeOptions.find((option) => option.value === type);

    setQuestionTitle(data.question);
    if (selectedType) setType(selectedType);
    if (data.options)
      setChoiceDescriptions(
        new Map(
          type !== "multiple-choice"
            ? [
                [1, ["", false]],
                [2, ["", false]],
              ]
            : data.options.map(({ description }, i) => {
                const choiceNum = i + 1;
                const isCorrect = choiceNum === Number(data.correctAnswer);
                return [choiceNum, [description, isCorrect]];
              }),
        ),
      );
    if (data.rationale)
      setChoiceExplanations(
        new Map(
          type !== "multiple-choice"
            ? [
                [1, ""],
                [2, ""],
              ]
            : data.rationale.map((text, i) => [i + 1, text]),
        ),
      );
    if (data.guide) setGuide(data.guide);
    if (type === "text-input") setCorrectAnswer(String(data.correctAnswer));
    if (
      type === "ox" &&
      (data.correctAnswer === "O" || data.correctAnswer === "X")
    )
      setCorrectAnswerOX(data.correctAnswer);
    setSelectedView(data.article ? "article" : "none");
    if (data.hint) setHint(data.hint);
    setPreview(null);
    if (data.article) setArticle(data.article);
    if (data.commentary) setExplanation(data.commentary);
    setFocusTarget(null);
    setQuizId(data.id);

    router.replace("/make_quiz");
  };

  const editQuiz = (data: questionData) => {
    setConfirmConfig({
      type: "danger",
      content: `수정하시겠습니까?
작성 중이던 문제가 있으면 내역이 날아갈 수 있습니다!`,
      onCancel: () => {
        setConfirmConfig(null);
      },
      onConfirm: () => {
        setConfirmConfig(null);
        edit(data);
      },
    });
  };

  const deleteQuizItem = async (
    data: questionData,
    type: "requested" | "question" | "rejected",
  ) => {
    await deleteDoc(doc(db, type, data.id));
  };

  const deleteQuiz = (
    data: questionData,
    type: "requested" | "question" | "rejected",
  ) => {
    setConfirmConfig({
      type: "danger",
      content: `삭제하시겠습니까?
삭제된 문제는 복구가 불가능합니다!`,
      onCancel: () => {
        setConfirmConfig(null);
      },
      onConfirm: () => {
        setInfoConfig({
          content: "삭제가 완료되었습니다.",
          onClose: () => {
            setInfoConfig(null);
          },
        });

        setConfirmConfig(null);
        deleteQuizItem(data, type);
      },
    });
  };

  const buttonStyle = `p-1 px-2
            text-[#727272]
            border border-[#727272] rounded`;

  const renderQuizItem = (
    data: questionData,
    type: "requested" | "question" | "rejected",
  ) => (
    <div
      key={data.id} // index 대신 data.id 권장
      role="button"
      className="relative w-[90%] ml-4 mb-3 px-4 py-3 border border-[#727272] rounded"
      onClick={() => setPreviewConfig({ id: data.id, questionType: type })}
    >
      <div
        className={`${type === "rejected" ? "w-[58%]" : "w-[70%]"} overflow-hidden`}
      >
        <div className="truncate">
          <ParsedText text={data.question} />
        </div>

        <div className="absolute right-3 bottom-1/2 translate-y-1/2">
          {type === "rejected" && (
            <button
              className={`${buttonStyle} mr-1`}
              onClick={(e) => {
                e.stopPropagation();
                if (data.reason) readRejectedReason(data.reason);
              }}
            >
              사유
            </button>
          )}
          <button
            className={`${buttonStyle} mr-1`}
            onClick={(e) => {
              e.stopPropagation();
              editQuiz(data);
            }}
          >
            수정
          </button>
          <button
            className={`${buttonStyle}`}
            onClick={(e) => {
              e.stopPropagation();
              deleteQuiz(data, type);
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[75%] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {user.role === "user" && (
        <>
          <h1 className="ml-4 mb-3 text-2xl">대기</h1>
          {requestedQuizList?.length ? (
            requestedQuizList.map((data) => renderQuizItem(data, "requested"))
          ) : (
            <div className="ml-6 text-lg text-gray-500">
              대기 중인 문제가 없습니다.
            </div>
          )}

          <h1 className="ml-4 mt-6 mb-3 text-2xl">거부</h1>
          {rejectedQuizList?.length ? (
            rejectedQuizList.map((data) => renderQuizItem(data, "rejected"))
          ) : (
            <div className="ml-6 text-lg text-gray-500">
              거부된 문제가 없습니다.
            </div>
          )}
        </>
      )}

      <h1 className="ml-4 mt-6 mb-3 text-2xl">
        {user.role === "user" ? "승인" : "문제 목록"}
      </h1>
      {quizList?.length ? (
        quizList.map((data) => renderQuizItem(data, "question"))
      ) : (
        <div className="ml-6 text-lg text-gray-500">
          승인된 문제가 없습니다.
        </div>
      )}

      {!requestedQuizList && !quizList && (
        <div className="ml-4 animate-pulse">불러오는 중...</div>
      )}
    </div>
  );
};

const Footer = () => {
  return <div className="relative"></div>;
};

export default function Requested() {
  const router = useRouter();
  const [locked, setLocked] = useState(true);

  const [user] = useAtom(userAtom);
  const [, setLoginConfig] = useAtom(loginConfigState);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      setLoginConfig({
        onClose: () => {
          router.back();
          setLoginConfig(null);
        },
      });
    } else {
      setLocked(false);
    }
  }, [user]);

  if (locked || !user) return;

  return (
    <div className="relative w-full h-full">
      <Header />
      <Section user={user} />
      <Footer />
      <RequestedPreview />
    </div>
  );
}
