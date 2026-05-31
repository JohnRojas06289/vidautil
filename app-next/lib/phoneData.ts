export interface PhoneModel {
  id: string;
  brand: string;
  model: string;
  productionCO2: number;
  annualUseCO2: number;
  releaseYear: number;
}

export const phoneModels: PhoneModel[] = [
  { id: "iphone-7",      brand: "Apple",    model: "iPhone 7",         productionCO2: 50, annualUseCO2: 3.0, releaseYear: 2016 },
  { id: "iphone-8",      brand: "Apple",    model: "iPhone 8",         productionCO2: 52, annualUseCO2: 3.2, releaseYear: 2017 },
  { id: "iphone-x",      brand: "Apple",    model: "iPhone X",         productionCO2: 60, annualUseCO2: 3.5, releaseYear: 2017 },
  { id: "iphone-11",     brand: "Apple",    model: "iPhone 11",        productionCO2: 72, annualUseCO2: 4.0, releaseYear: 2019 },
  { id: "iphone-12",     brand: "Apple",    model: "iPhone 12",        productionCO2: 70, annualUseCO2: 4.0, releaseYear: 2020 },
  { id: "iphone-13",     brand: "Apple",    model: "iPhone 13",        productionCO2: 64, annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "iphone-14",     brand: "Apple",    model: "iPhone 14",        productionCO2: 61, annualUseCO2: 4.0, releaseYear: 2022 },
  { id: "iphone-15",     brand: "Apple",    model: "iPhone 15",        productionCO2: 66, annualUseCO2: 4.0, releaseYear: 2023 },
  { id: "samsung-a50",   brand: "Samsung",  model: "Galaxy A50",       productionCO2: 45, annualUseCO2: 3.5, releaseYear: 2019 },
  { id: "samsung-a52",   brand: "Samsung",  model: "Galaxy A52",       productionCO2: 50, annualUseCO2: 3.5, releaseYear: 2021 },
  { id: "samsung-s20",   brand: "Samsung",  model: "Galaxy S20",       productionCO2: 68, annualUseCO2: 4.5, releaseYear: 2020 },
  { id: "samsung-s22",   brand: "Samsung",  model: "Galaxy S22",       productionCO2: 70, annualUseCO2: 4.5, releaseYear: 2022 },
  { id: "samsung-s23",   brand: "Samsung",  model: "Galaxy S23",       productionCO2: 72, annualUseCO2: 4.5, releaseYear: 2023 },
  { id: "xiaomi-redmi9", brand: "Xiaomi",   model: "Redmi Note 9",     productionCO2: 40, annualUseCO2: 3.0, releaseYear: 2020 },
  { id: "xiaomi-redmi11",brand: "Xiaomi",   model: "Redmi Note 11",    productionCO2: 45, annualUseCO2: 3.5, releaseYear: 2022 },
  { id: "xiaomi-mi-11",  brand: "Xiaomi",   model: "Mi 11",            productionCO2: 60, annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "moto-g60",      brand: "Motorola", model: "Moto G60",         productionCO2: 42, annualUseCO2: 3.0, releaseYear: 2021 },
  { id: "moto-edge",     brand: "Motorola", model: "Edge 30",          productionCO2: 55, annualUseCO2: 3.8, releaseYear: 2022 },
  { id: "other-android", brand: "Otro",     model: "Android genérico", productionCO2: 55, annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "other-ios",     brand: "Otro",     model: "iPhone genérico",  productionCO2: 65, annualUseCO2: 4.0, releaseYear: 2021 },
];
