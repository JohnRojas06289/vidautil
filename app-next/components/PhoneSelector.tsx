"use client";
import { PhoneModel, phoneModels } from "@/lib/phoneData";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  value: PhoneModel | null;
  onChange: (phone: PhoneModel) => void;
}

const brands = ["Apple", "Samsung", "Xiaomi", "Motorola", "Otro"];

export function PhoneSelector({ value, onChange }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string>(value?.brand ?? "");
  const brandModels = phoneModels.filter((p) => p.brand === selectedBrand);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-vu-textSecondary text-sm uppercase tracking-widest">Marca</label>
      <div className="grid grid-cols-5 gap-2">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`rounded-xl py-2 px-1 text-xs font-medium transition-colors ${
              selectedBrand === brand
                ? "bg-vu-accent text-vu-bg"
                : "bg-vu-bgAlt text-vu-textSecondary hover:bg-vu-accent/30"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {selectedBrand && (
        <>
          <label className="text-vu-textSecondary text-sm uppercase tracking-widest mt-2">Modelo</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-vu-bgAlt text-vu-textPrimary rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-vu-accent"
              value={value?.id ?? ""}
              onChange={(e) => {
                const found = phoneModels.find((p) => p.id === e.target.value);
                if (found) onChange(found);
              }}
            >
              <option value="">Selecciona un modelo...</option>
              {brandModels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.model}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-vu-textSecondary w-5 h-5 pointer-events-none" />
          </div>
        </>
      )}
    </div>
  );
}
