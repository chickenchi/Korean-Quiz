import { atom } from "jotai";

export const questionTitleAtom = atom<string>("");

export interface typeOption {
    id: number,
    name: string,
    value: string
}

export const typeOptions: typeOption[] = [
    { id: 1, name: "다지선다", value: "multiple-choice" },
    { id: 2, name: "주관식", value: "text-input" },
    { id: 3, name: "OX", value: "ox" },
];
export const typeAtom = atom(typeOptions[0]);

export const choiceDescriptionAtom = atom<Map<number, [string, boolean]>>(
    new Map<number, [string, boolean]>([[1, ["", false]], [2, ["", false]]]));
export const choiceExplanationAtom = atom<Map<number, string>>(
    new Map<number, string>([[1, ""], [2, ""]]));

export const guideAtom = atom<string>("");
export const correctAnswerAtom = atom<string>("");
export const correctAnswerOXAtom = atom<"O" | "X" | null>(null);

export const selectedViewAtom = atom<"none" | "image" | "article">("none");

export const hintAtom = atom<string>("");

export const previewAtom = atom<string | null>(null);
export const articleAtom = atom<string>("");
export const explanationAtom = atom<string>("");

export const focusTargetAtom = atom<string | null>(null);

export const loadingAtom = atom<boolean>(false);

export const showPreviewAtom = atom<boolean>(false);

export const resetAllWroteItemsAtom = atom(null, (get, set) => {
  set(questionTitleAtom, "");
  set(typeAtom, { id: 1, name: "다지선다", value: "multiple-choice" }); // 기본 타입값
  set(choiceDescriptionAtom, new Map<number, [string, boolean]>([[1, ["", false]], [2, ["", false]]])); // 4지 선다 등 초기 배열
  set(choiceExplanationAtom, new Map<number, string>([[1, ""], [2, ""]]));
  set(guideAtom, "");
  set(correctAnswerAtom, "");
  set(correctAnswerOXAtom, null);
  set(selectedViewAtom, "none");
  set(hintAtom, "");
  set(previewAtom, null);
  set(articleAtom, "");
  set(explanationAtom, "");
  set(focusTargetAtom, null);
  // 추가된 모든 아톰을 여기에 넣으세요!
});