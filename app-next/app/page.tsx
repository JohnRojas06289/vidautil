"use client";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { PhoneSelector } from "@/components/PhoneSelector";
import { YearsSlider } from "@/components/YearsSlider";
import { BatterySelector } from "@/components/BatterySelector";
import { useVidaUtilStore } from "@/lib/store";
import { calculateFootprint } from "@/lib/carbonCalc";
import { mapToMarkerId } from "@/lib/markerMapping";

export default function HomePage() {
  const router = useRouter();
  const { selectedPhone, yearsOfUse, batteryState, setPhone, setYears, setBattery, setFootprint } =
    useVidaUtilStore();

  const isReady = selectedPhone !== null && yearsOfUse > 0;

  function handleSubmit() {
    if (!selectedPhone) return;
    const footprint = calculateFootprint(selectedPhone, yearsOfUse, batteryState);
    const markerId = mapToMarkerId(footprint);
    setFootprint(footprint, markerId);
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
          <PhoneSelector value={selectedPhone} onChange={setPhone} />
          <YearsSlider value={yearsOfUse} onChange={setYears} />
          <BatterySelector value={batteryState} onChange={setBattery} />
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
      </div>
    </main>
  );
}
