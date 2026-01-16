import { atom } from 'jotai';
import { questionData } from '../data/quiz_data';

export const timeState = atom<number>(0);
export const startedState = atom<boolean>(true);
export const showResultState = atom<boolean>(false);

export const questionState = atom<questionData | null>(null);
export const viewedQuizState = atom<Set<number>>(new Set<number>());

export const answerState = atom<string>('');
export const hintState = atom<string | undefined>(undefined);
export const hintCountState = atom<number>(1);

export const listOpenState = atom<boolean>(false);

interface ConfirmModal {
    type?: 'default' | 'danger';
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
}

interface InfoModal {
    content: string;
    onClose: () => void;
}

export const confirmConfigState = atom<ConfirmModal | null>(null);
export const infoConfigState = atom<InfoModal | null>(null);