import { atom } from 'jotai';
import { questionData } from '../requested_admin/page';


export const timeState = atom<number>(0);
export const startedState = atom<boolean>(true);
export const showResultState = atom<boolean>(false);

export const questionState = atom<questionData | null>(null);
export const viewedQuizState = atom<Set<string>>(new Set<string>());

export const answerState = atom<string>('');
export const hintState = atom<string | undefined>(undefined);
export const hintCountState = atom<number>(1000);

export const listOpenState = atom<boolean>(false);

export const openExplanationSheetState = atom(false);
export const openViewState = atom(false);