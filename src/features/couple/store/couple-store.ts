import { create } from 'zustand';

export interface CoupleState {
  generatedCode: string | null;
  setGeneratedCode: (code: string | null) => void;
  clearCouple: () => void;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  generatedCode: null,
  setGeneratedCode: (generatedCode) => set({ generatedCode }),
  clearCouple: () => set({ generatedCode: null }),
}));
