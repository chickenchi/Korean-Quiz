import { atom } from "jotai";

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

interface InputModal {
    content: string;
    placeholder?: string;
    onConfirm: (content: string) => void;
    onCancel: () => void;
}

interface LoginModal {
    onClose: () => void;
}

export const confirmConfigState = atom<ConfirmModal | null>(null);
export const infoConfigState = atom<InfoModal | null>(null);

export const inputConfigState = atom<InputModal | null>(null);
export const inputModalCloseState = atom(null, (get, set) => {
    set(inputConfigState, null);
})

export const loginConfigState = atom<LoginModal | null>(null);