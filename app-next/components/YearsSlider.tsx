"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function YearsSlider({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-vu-textSecondary text-sm uppercase tracking-widest">
        Tiempo con tu celular
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={8}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-4xl font-medium text-vu-accentLight">{value}</span>
          <span className="text-xs text-vu-textSecondary">{value === 1 ? "año" : "años"}</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-vu-textSecondary px-1">
        <span>Menos de 1</span>
        <span>8 años</span>
      </div>
    </div>
  );
}
