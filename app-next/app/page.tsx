"use client";
import { useRouter } from "next/navigation";
import { Leaf, Monitor } from "lucide-react";
import { YearsSlider } from "@/components/YearsSlider";
import { useVidaUtilStore } from "@/lib/store";
import { calculateFootprint, findPhoneByText } from "@/lib/carbonCalc";

export default function HomePage() {
  const router = useRouter();
  const { phoneModelText, yearsOfUse, setPhoneText, setYears, setFootprint } =
    useVidaUtilStore();

  const isReady = phoneModelText.trim().length > 0 && yearsOfUse > 0;

  function handleSubmit() {
    const phone = findPhoneByText(phoneModelText);
    const footprint = calculateFootprint(phone, yearsOfUse, phoneModelText.trim());
    setFootprint(footprint);
    router.push("/huella");
  }

  return (
    <main className="min-h-screen bg-vu-bg flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="w-14 h-14 bg-vu-accent rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-vu-bg" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-medium text-vu-textPrimary">VidaÚtil</h1>
            <p className="text-sm text-vu-textSecondary italic mt-1">
              Premia lo que ya haces bien
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 bg-vu-bgAlt rounded-2xl p-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-vu-textSecondary">
              ¿Qué celular tienes?
            </label>
            <input
              type="text"
              value={phoneModelText}
              onChange={(e) => setPhoneText(e.target.value)}
              placeholder="ej. iPhone 13, Galaxy S22, Redmi Note 11..."
              className="w-full bg-vu-bg text-vu-textPrimary placeholder-vu-textSecondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vu-accent"
            />
          </div>
          <YearsSlider value={yearsOfUse} onChange={setYears} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`w-full py-4 rounded-xl font-medium text-base transition-all ${
            isReady
              ? "bg-vu-accent text-vu-bg hover:bg-vu-accentLight cursor-pointer"
              : "bg-vu-bgAlt text-vu-textSecondary cursor-not-allowed opacity-50"
          }`}
        >
          Ver mi huella
        </button>

        <p className="text-xs text-vu-textSecondary text-center opacity-60">
          Datos basados en Belkhir &amp; Elmeligi (2018) y reportes ambientales de fabricantes.
        </p>

        <button
          onClick={() => router.push("/proyector")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-vu-bgAlt text-vu-textSecondary text-sm hover:border-vu-accent hover:text-vu-accentLight transition-colors"
        >
          <Monitor className="w-4 h-4" />
          Abrir proyector
        </button>
      </div>
    </main>
  );
}
