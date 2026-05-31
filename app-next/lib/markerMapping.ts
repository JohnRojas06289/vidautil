import { FootprintResult } from "./carbonCalc";

export function mapToMarkerId(footprint: FootprintResult): number {
  const f = footprint.annualFootprint;
  if (f < 15) return 0;
  if (f < 22) return 5;
  if (f < 30) return 12;
  if (f < 40) return 23;
  return 47;
}

export const FIXED_MARKERS = {
  NEW_PHONE: 89,
  RECYCLE: 102,
  SECOND_HAND: 67,
} as const;
