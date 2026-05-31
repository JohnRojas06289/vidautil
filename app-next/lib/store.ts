import { create } from "zustand";
import { PhoneModel } from "./phoneData";
import { FootprintResult } from "./carbonCalc";

interface VidaUtilState {
  selectedPhone: PhoneModel | null;
  yearsOfUse: number;
  batteryState: number;
  footprint: FootprintResult | null;
  markerId: number | null;
  setPhone: (p: PhoneModel) => void;
  setYears: (y: number) => void;
  setBattery: (b: number) => void;
  setFootprint: (f: FootprintResult, markerId: number) => void;
  reset: () => void;
}

export const useVidaUtilStore = create<VidaUtilState>((set) => ({
  selectedPhone: null,
  yearsOfUse: 2,
  batteryState: 3,
  footprint: null,
  markerId: null,
  setPhone: (p) => set({ selectedPhone: p }),
  setYears: (y) => set({ yearsOfUse: y }),
  setBattery: (b) => set({ batteryState: b }),
  setFootprint: (f, markerId) => set({ footprint: f, markerId }),
  reset: () => set({ selectedPhone: null, yearsOfUse: 2, batteryState: 3, footprint: null, markerId: null }),
}));
