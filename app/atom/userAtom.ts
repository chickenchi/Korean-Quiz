import { atom } from "jotai";

export interface UserState {
  uid: string;
  email: string | null;
  role: "admin" | "user"; // 권한 분리를 위해 필수!
}

export const userAtom = atom<UserState | null | undefined>(undefined);