import { atom } from 'jotai';

export const timeState = atom<number>(0);
export const startedState = atom<boolean>(true);
export const answerState = atom<string>('');
export const hintState = atom<string>("그림에 답이 있습니다.");
export const hintCountState = atom<number>(1);

export const listOpenState = atom<boolean>(false);

interface ConfirmModal {
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