import { create } from "zustand";
import { FootprintResult } from "./carbonCalc";

interface VidaUtilState {
  phoneModelText: string;
  yearsOfUse: number;
  footprint: FootprintResult | null;
  planChange: string;
  setPhoneText: (t: string) => void;
  setYears: (y: number) => void;
  setFootprint: (f: FootprintResult) => void;
  setPlanChange: (p: string) => void;
  reset: () => void;
}

export const useVidaUtilStore = create<VidaUtilState>((set) => ({
  phoneModelText: "",
  yearsOfUse: 2,
  footprint: null,
  planChange: "",
  setPhoneText: (t) => set({ phoneModelText: t }),
  setYears: (y) => set({ yearsOfUse: y }),
  setFootprint: (f) => set({ footprint: f }),
  setPlanChange: (p) => set({ planChange: p }),
  reset: () => set({ phoneModelText: "", yearsOfUse: 2, footprint: null, planChange: "" }),
}));
