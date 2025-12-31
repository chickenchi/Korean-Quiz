import { atom } from 'jotai';

export const timeState = atom<number>(0);
export const startedState = atom<boolean>(true);
export const listOpenState = atom<boolean>(false);