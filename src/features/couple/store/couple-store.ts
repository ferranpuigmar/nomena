import { create } from 'zustand';
import { withDevtools } from '@src/lib/zustand.ts';

export interface CoupleState {
  generatedCode: string | null;
  setGeneratedCode: (code: string | null) => void;
  clearCouple: () => void;
}

export const useCoupleStore = create<CoupleState>()(
  withDevtools('couple-store', (set) => ({
    generatedCode: null,
    setGeneratedCode: (generatedCode) => set({ generatedCode }),
    clearCouple: () => set({ generatedCode: null }),
  })),
);
