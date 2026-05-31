import { PhoneModel } from "./phoneData";

export type Medal = "bronze" | "silver" | "gold";

export interface FootprintResult {
  annualFootprint: number;
  totalAvoidedCO2: number;
  costOfChangeNow: number;
  monthsEquivalent: number;
  medal: Medal;
  yearsBadgeLabel: string;
  equivalenceKmCar: number;
  equivalenceTrees: number;
}

const NEW_PHONE_PRODUCTION_CO2 = 65;

export function calculateFootprint(
  model: PhoneModel,
  yearsOfUse: number,
  batteryState: number = 3
): FootprintResult {
  const batteryFactor = 1 + (3 - batteryState) * 0.15;
  const amortization = model.productionCO2 / Math.max(yearsOfUse, 1);
  const useEnergy = model.annualUseCO2 * batteryFactor;
  const annualFootprint = amortization + useEnergy;

  const yearsAvoided = Math.max(yearsOfUse - 2, 0);
  const totalAvoidedCO2 = yearsAvoided > 0
    ? Math.round(NEW_PHONE_PRODUCTION_CO2 * (yearsAvoided / 2))
    : 0;

  const remainingAmortization = model.productionCO2 - (amortization * yearsOfUse);
  const costOfChangeNow = Math.round(NEW_PHONE_PRODUCTION_CO2 - Math.max(remainingAmortization, 0));

  const monthsEquivalent = Math.round(costOfChangeNow / (annualFootprint / 12));

  let medal: Medal = "bronze";
  let yearsBadgeLabel = `Bronce — ${yearsOfUse} años contigo`;
  if (yearsOfUse >= 4) {
    medal = "gold";
    yearsBadgeLabel = `Oro — ${yearsOfUse} años contigo`;
  } else if (yearsOfUse >= 3) {
    medal = "silver";
    yearsBadgeLabel = `Plata — ${yearsOfUse} años contigo`;
  }

  const equivalenceKmCar = Math.round(totalAvoidedCO2 / 0.21);
  const equivalenceTrees = Math.max(Math.round(totalAvoidedCO2 / 22), 1);

  return {
    annualFootprint: Math.round(annualFootprint * 10) / 10,
    totalAvoidedCO2,
    costOfChangeNow,
    monthsEquivalent,
    medal,
    yearsBadgeLabel,
    equivalenceKmCar,
    equivalenceTrees,
  };
}
