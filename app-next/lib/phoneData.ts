export interface PhoneModel {
  id: string;
  brand: string;
  model: string;
  productionCO2: number;
  annualUseCO2: number;
  releaseYear: number;
}

export const phoneModels: PhoneModel[] = [
  // Apple
  { id: "iphone-7",       brand: "Apple",    model: "iPhone 7",          productionCO2: 50,  annualUseCO2: 3.0, releaseYear: 2016 },
  { id: "iphone-8",       brand: "Apple",    model: "iPhone 8",          productionCO2: 52,  annualUseCO2: 3.2, releaseYear: 2017 },
  { id: "iphone-x",       brand: "Apple",    model: "iPhone X",          productionCO2: 60,  annualUseCO2: 3.5, releaseYear: 2017 },
  { id: "iphone-xr",      brand: "Apple",    model: "iPhone XR",         productionCO2: 57,  annualUseCO2: 3.5, releaseYear: 2018 },
  { id: "iphone-xs",      brand: "Apple",    model: "iPhone XS",         productionCO2: 62,  annualUseCO2: 3.5, releaseYear: 2018 },
  { id: "iphone-11",      brand: "Apple",    model: "iPhone 11",         productionCO2: 72,  annualUseCO2: 4.0, releaseYear: 2019 },
  { id: "iphone-11pro",   brand: "Apple",    model: "iPhone 11 Pro",     productionCO2: 80,  annualUseCO2: 4.2, releaseYear: 2019 },
  { id: "iphone-12",      brand: "Apple",    model: "iPhone 12",         productionCO2: 70,  annualUseCO2: 4.0, releaseYear: 2020 },
  { id: "iphone-12mini",  brand: "Apple",    model: "iPhone 12 mini",    productionCO2: 64,  annualUseCO2: 3.8, releaseYear: 2020 },
  { id: "iphone-12pro",   brand: "Apple",    model: "iPhone 12 Pro",     productionCO2: 82,  annualUseCO2: 4.5, releaseYear: 2020 },
  { id: "iphone-13",      brand: "Apple",    model: "iPhone 13",         productionCO2: 64,  annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "iphone-13mini",  brand: "Apple",    model: "iPhone 13 mini",    productionCO2: 58,  annualUseCO2: 3.8, releaseYear: 2021 },
  { id: "iphone-13pro",   brand: "Apple",    model: "iPhone 13 Pro",     productionCO2: 77,  annualUseCO2: 4.5, releaseYear: 2021 },
  { id: "iphone-14",      brand: "Apple",    model: "iPhone 14",         productionCO2: 61,  annualUseCO2: 4.0, releaseYear: 2022 },
  { id: "iphone-14plus",  brand: "Apple",    model: "iPhone 14 Plus",    productionCO2: 68,  annualUseCO2: 4.2, releaseYear: 2022 },
  { id: "iphone-14pro",   brand: "Apple",    model: "iPhone 14 Pro",     productionCO2: 76,  annualUseCO2: 4.5, releaseYear: 2022 },
  { id: "iphone-15",      brand: "Apple",    model: "iPhone 15",         productionCO2: 66,  annualUseCO2: 4.0, releaseYear: 2023 },
  { id: "iphone-15plus",  brand: "Apple",    model: "iPhone 15 Plus",    productionCO2: 72,  annualUseCO2: 4.2, releaseYear: 2023 },
  { id: "iphone-15pro",   brand: "Apple",    model: "iPhone 15 Pro",     productionCO2: 81,  annualUseCO2: 4.5, releaseYear: 2023 },
  { id: "iphone-16",      brand: "Apple",    model: "iPhone 16",         productionCO2: 66,  annualUseCO2: 4.0, releaseYear: 2024 },
  { id: "iphone-16pro",   brand: "Apple",    model: "iPhone 16 Pro",     productionCO2: 83,  annualUseCO2: 4.5, releaseYear: 2024 },
  // Samsung Galaxy S
  { id: "samsung-s20",    brand: "Samsung",  model: "Galaxy S20",        productionCO2: 68,  annualUseCO2: 4.5, releaseYear: 2020 },
  { id: "samsung-s21",    brand: "Samsung",  model: "Galaxy S21",        productionCO2: 67,  annualUseCO2: 4.3, releaseYear: 2021 },
  { id: "samsung-s22",    brand: "Samsung",  model: "Galaxy S22",        productionCO2: 70,  annualUseCO2: 4.5, releaseYear: 2022 },
  { id: "samsung-s23",    brand: "Samsung",  model: "Galaxy S23",        productionCO2: 72,  annualUseCO2: 4.5, releaseYear: 2023 },
  { id: "samsung-s23fe",  brand: "Samsung",  model: "Galaxy S23 FE",     productionCO2: 63,  annualUseCO2: 4.2, releaseYear: 2023 },
  { id: "samsung-s24",    brand: "Samsung",  model: "Galaxy S24",        productionCO2: 73,  annualUseCO2: 4.5, releaseYear: 2024 },
  { id: "samsung-s24ultra",brand:"Samsung",  model: "Galaxy S24 Ultra",  productionCO2: 98,  annualUseCO2: 5.0, releaseYear: 2024 },
  // Samsung Galaxy A
  { id: "samsung-a32",    brand: "Samsung",  model: "Galaxy A32",        productionCO2: 43,  annualUseCO2: 3.3, releaseYear: 2021 },
  { id: "samsung-a50",    brand: "Samsung",  model: "Galaxy A50",        productionCO2: 45,  annualUseCO2: 3.5, releaseYear: 2019 },
  { id: "samsung-a52",    brand: "Samsung",  model: "Galaxy A52",        productionCO2: 50,  annualUseCO2: 3.5, releaseYear: 2021 },
  { id: "samsung-a53",    brand: "Samsung",  model: "Galaxy A53",        productionCO2: 52,  annualUseCO2: 3.6, releaseYear: 2022 },
  { id: "samsung-a54",    brand: "Samsung",  model: "Galaxy A54",        productionCO2: 54,  annualUseCO2: 3.7, releaseYear: 2023 },
  { id: "samsung-a14",    brand: "Samsung",  model: "Galaxy A14",        productionCO2: 38,  annualUseCO2: 3.0, releaseYear: 2023 },
  { id: "samsung-a15",    brand: "Samsung",  model: "Galaxy A15",        productionCO2: 39,  annualUseCO2: 3.0, releaseYear: 2024 },
  { id: "samsung-a25",    brand: "Samsung",  model: "Galaxy A25",        productionCO2: 46,  annualUseCO2: 3.4, releaseYear: 2024 },
  // Xiaomi / Redmi
  { id: "xiaomi-redmi9",  brand: "Xiaomi",   model: "Redmi Note 9",      productionCO2: 40,  annualUseCO2: 3.0, releaseYear: 2020 },
  { id: "xiaomi-redmi10", brand: "Xiaomi",   model: "Redmi Note 10",     productionCO2: 43,  annualUseCO2: 3.2, releaseYear: 2021 },
  { id: "xiaomi-redmi11", brand: "Xiaomi",   model: "Redmi Note 11",     productionCO2: 45,  annualUseCO2: 3.5, releaseYear: 2022 },
  { id: "xiaomi-redmi12", brand: "Xiaomi",   model: "Redmi Note 12",     productionCO2: 46,  annualUseCO2: 3.5, releaseYear: 2023 },
  { id: "xiaomi-redmi13", brand: "Xiaomi",   model: "Redmi Note 13",     productionCO2: 47,  annualUseCO2: 3.5, releaseYear: 2024 },
  { id: "xiaomi-mi-11",   brand: "Xiaomi",   model: "Mi 11",             productionCO2: 60,  annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "xiaomi-12",      brand: "Xiaomi",   model: "Xiaomi 12",         productionCO2: 63,  annualUseCO2: 4.2, releaseYear: 2022 },
  { id: "xiaomi-13",      brand: "Xiaomi",   model: "Xiaomi 13",         productionCO2: 65,  annualUseCO2: 4.3, releaseYear: 2023 },
  { id: "poco-x3",        brand: "Xiaomi",   model: "POCO X3",           productionCO2: 42,  annualUseCO2: 3.2, releaseYear: 2020 },
  { id: "poco-x5",        brand: "Xiaomi",   model: "POCO X5",           productionCO2: 46,  annualUseCO2: 3.4, releaseYear: 2023 },
  // Motorola
  { id: "moto-g20",       brand: "Motorola", model: "Moto G20",          productionCO2: 38,  annualUseCO2: 2.8, releaseYear: 2021 },
  { id: "moto-g30",       brand: "Motorola", model: "Moto G30",          productionCO2: 40,  annualUseCO2: 3.0, releaseYear: 2021 },
  { id: "moto-g52",       brand: "Motorola", model: "Moto G52",          productionCO2: 43,  annualUseCO2: 3.2, releaseYear: 2022 },
  { id: "moto-g54",       brand: "Motorola", model: "Moto G54",          productionCO2: 44,  annualUseCO2: 3.2, releaseYear: 2023 },
  { id: "moto-g60",       brand: "Motorola", model: "Moto G60",          productionCO2: 42,  annualUseCO2: 3.0, releaseYear: 2021 },
  { id: "moto-g84",       brand: "Motorola", model: "Moto G84",          productionCO2: 48,  annualUseCO2: 3.5, releaseYear: 2023 },
  { id: "moto-edge",      brand: "Motorola", model: "Edge 30",           productionCO2: 55,  annualUseCO2: 3.8, releaseYear: 2022 },
  { id: "moto-edge40",    brand: "Motorola", model: "Edge 40",           productionCO2: 57,  annualUseCO2: 3.9, releaseYear: 2023 },
  // Huawei
  { id: "huawei-p30",     brand: "Huawei",   model: "P30",               productionCO2: 55,  annualUseCO2: 3.8, releaseYear: 2019 },
  { id: "huawei-p40",     brand: "Huawei",   model: "P40",               productionCO2: 60,  annualUseCO2: 4.0, releaseYear: 2020 },
  { id: "huawei-y9",      brand: "Huawei",   model: "Y9",                productionCO2: 40,  annualUseCO2: 3.0, releaseYear: 2019 },
  // Google Pixel
  { id: "pixel-6",        brand: "Google",   model: "Pixel 6",           productionCO2: 68,  annualUseCO2: 4.2, releaseYear: 2021 },
  { id: "pixel-7",        brand: "Google",   model: "Pixel 7",           productionCO2: 65,  annualUseCO2: 4.0, releaseYear: 2022 },
  { id: "pixel-8",        brand: "Google",   model: "Pixel 8",           productionCO2: 68,  annualUseCO2: 4.2, releaseYear: 2023 },
  // OnePlus
  { id: "oneplus-9",      brand: "OnePlus",  model: "OnePlus 9",         productionCO2: 65,  annualUseCO2: 4.2, releaseYear: 2021 },
  { id: "oneplus-nord",   brand: "OnePlus",  model: "Nord CE 2",         productionCO2: 47,  annualUseCO2: 3.4, releaseYear: 2022 },
  // Genéricos
  { id: "other-android",  brand: "Otro",     model: "Android genérico",  productionCO2: 55,  annualUseCO2: 4.0, releaseYear: 2021 },
  { id: "other-ios",      brand: "Otro",     model: "iPhone genérico",   productionCO2: 65,  annualUseCO2: 4.0, releaseYear: 2021 },
];
