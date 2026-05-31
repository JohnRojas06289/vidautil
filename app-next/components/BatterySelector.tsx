"use client";
import { BatteryLow, Battery, BatteryMedium, BatteryFull, BatteryCharging } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const levels = [
  { value: 1, label: "Muy degradada", Icon: BatteryLow },
  { value: 2, label: "Algo deteriorada", Icon: BatteryMedium },
  { value: 3, label: "Normal", Icon: Battery },
  { value: 4, label: "Buen estado", Icon: BatteryFull },
  { value: 5, label: "Excelente", Icon: BatteryCharging },
];

export function BatterySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-vu-textSecondary text-sm uppercase tracking-widest">
        Estado de la batería
      </label>
      <div className="flex gap-2">
        {levels.map(({ value: v, label, Icon }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            title={label}
            className={`flex-1 flex flex-col items-center gap-1 rounded-xl py-3 transition-colors ${
              value === v
                ? "bg-vu-accent text-vu-bg"
                : "bg-vu-bgAlt text-vu-textSecondary hover:bg-vu-accent/30"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{v}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-vu-textSecondary text-center">
        {levels.find((l) => l.value === value)?.label}
      </p>
    </div>
  );
}
