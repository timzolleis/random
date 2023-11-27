import {create} from "zustand";

type StepStore = {
    step: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

export const useStepStore = create<StepStore>((set) => ({
    step: 1,
    increment: () => set((state) => ({step: state.step + 1})),
    decrement: () => set((state) => ({step: state.step - 1})),
    reset: () => set({step: 1}),
}));