import { atom } from "jotai";

interface Preview {
    id: string;
    questionType: "requested" | "rejected" | "question";
}

export const previewConfigAtom = atom<Preview | null>(null);