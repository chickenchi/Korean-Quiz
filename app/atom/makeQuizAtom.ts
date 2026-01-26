import { atom } from "jotai";

export const questionTitleAtom = atom<string>("");

export const typeOptions = [
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