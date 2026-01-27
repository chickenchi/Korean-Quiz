import { viewedQuizState } from "@/app/atom/quizAtom";
import { db } from "@/app/lib/client";
import { questionData } from "@/app/requested_admin/page";
import { collection, getDocs } from "firebase/firestore";
import { getDefaultStore } from "jotai";

export const selectQuestion = async () => {
  const store = getDefaultStore();
  const viewedQuiz = store.get(viewedQuizState);

  // 1. 전체 문제 가져오기
  const querySnapshot = await getDocs(collection(db, "question"));
  const allQuestions = querySnapshot.docs.map(doc => ({
    ...(doc.data() as questionData),
    id: doc.id
  }));

  // 2. 아직 안 본 문제 필터링
  let unviewed = allQuestions.filter((q) => !viewedQuiz.has(q.id));
    
  // 3. 모든 문제를 다 봤을 때 (초기화 로직)
  if (unviewed.length === 0) {
    // 마지막으로 봤던 문제 ID 찾기 (Set의 마지막 요소는 약간 까다로우니 변수로 관리하거나 간단하게 처리)
    const lastId = Array.from(viewedQuiz).pop(); 

    // 전체 문제 수가 1개보다 많을 때만 방금 본 문제를 제외하고 초기화
    if (allQuestions.length > 1) {
      unviewed = allQuestions.filter(q => q.id !== lastId);
      // 새 Set에는 방금 제외했던 lastId를 넣지 않고 비워주거나, 
      // 현재 로직상 아래에서 selected.id를 add하므로 빈 Set으로 세팅
      store.set(viewedQuizState, new Set());
    } else {
      // 문제가 1개뿐이면 그냥 그대로 진행
      unviewed = allQuestions;
      store.set(viewedQuizState, new Set());
    }
  }

  // 4. 랜덤 선택
  const randomIndex = Math.floor(Math.random() * unviewed.length);
  const selected = unviewed[randomIndex];

  // 5. 본 문제 목록에 추가
  store.set(viewedQuizState, (prev) => {
    const next = new Set(prev);
    // 만약 위에서 초기화가 일어났다면 이미 비어있는 상태일 수도 있음
    next.add(selected.id);
    return next;
  });
  
  return selected;
};