import { PhoneModel, phoneModels } from "./phoneData";

export type Medal = "bronze" | "silver" | "gold";

export interface FootprintResult {
  modelName: string;
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

const AVERAGE_PHONE: PhoneModel = {
  id: "average",
  brand: "Otro",
  model: "Smartphone",
  productionCO2: 55,
  annualUseCO2: 3.8,
  releaseYear: 2021,
};

export function findPhoneByText(text: string): PhoneModel {
  const q = text.toLowerCase().trim();
  if (!q) return AVERAGE_PHONE;

  // Exact or partial match against model name
  const match = phoneModels.find((p) =>
    p.model.toLowerCase().includes(q) || q.includes(p.model.toLowerCase())
  );
  if (match) return match;

  // Brand-level fallback
  const brandMatch = phoneModels.find((p) => q.includes(p.brand.toLowerCase()));
  if (brandMatch) return brandMatch;

  // iOS vs Android fallback
  if (q.includes("iphone") || q.includes("ios") || q.includes("apple")) {
    return phoneModels.find((p) => p.id === "other-ios")!;
  }

  return AVERAGE_PHONE;
}

export function calculateFootprint(
  model: PhoneModel,
  yearsOfUse: number,
  modelName: string,
  usageMultiplier = 1.0,
): FootprintResult {
  const amortization = model.productionCO2 / Math.max(yearsOfUse, 1);
  const annualFootprint = amortization + model.annualUseCO2 * usageMultiplier;

  const yearsAvoided = Math.max(yearsOfUse - 2, 0);
  const totalAvoidedCO2 =
    yearsAvoided > 0 ? Math.round(NEW_PHONE_PRODUCTION_CO2 * (yearsAvoided / 2)) : 0;

  const remainingAmortization = model.productionCO2 - amortization * yearsOfUse;
  const costOfChangeNow = Math.round(
    NEW_PHONE_PRODUCTION_CO2 - Math.max(remainingAmortization, 0)
  );

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
    modelName,
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
