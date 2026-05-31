import { create } from "zustand";
import { FootprintResult } from "./carbonCalc";

interface VidaUtilState {
  phoneModelText: string;
  yearsOfUse: number;
  footprint: FootprintResult | null;
  setPhoneText: (t: string) => void;
  setYears: (y: number) => void;
  setFootprint: (f: FootprintResult) => void;
  reset: () => void;
}

export const useVidaUtilStore = create<VidaUtilState>((set) => ({
  phoneModelText: "",
  yearsOfUse: 2,
  footprint: null,
  setPhoneText: (t) => set({ phoneModelText: t }),
  setYears: (y) => set({ yearsOfUse: y }),
  setFootprint: (f) => set({ footprint: f }),
  reset: () => set({ phoneModelText: "", yearsOfUse: 2, footprint: null }),
}));
