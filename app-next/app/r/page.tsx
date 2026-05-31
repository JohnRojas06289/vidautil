"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Award, Car, Trees } from "lucide-react";
import { FootprintResult, calculateFootprint, findPhoneByText } from "@/lib/carbonCalc";

const MEDAL_COLORS = {
  b: { bg: "#A0522D", border: "#D4A574", label: "Bronce" },
  s: { bg: "#B4B2A9", border: "#D3D1C7", label: "Plata" },
  g: { bg: "#D4AF37", border: "#F4D67E", label: "Oro" },
};

function ResultView({ m, y, c, x }: { m: string; y: number; c: number; x: "b"|"s"|"g" }) {
  const medal = MEDAL_COLORS[x] ?? MEDAL_COLORS.b;
  const full: FootprintResult = useMemo(() => {
    const phone = findPhoneByText(m);
    return calculateFootprint(phone, y, m);
  }, [m, y]);

  return (
    <main className="min-h-screen bg-vu-bg flex flex-col items-center px-6 py-12 gap-8">
      <div className="text-center">
        <p className="text-vu-textSecondary text-xs uppercase tracking-widest mb-1">Tu huella</p>
        <h1 className="text-vu-textPrimary text-2xl font-medium">{m}</h1>
        <p className="text-vu-textSecondary text-sm mt-1">
          {y} {y === 1 ? "año" : "años"} contigo
        </p>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="flex flex-col items-center gap-2"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: medal.bg, border: `3px solid ${medal.border}` }}
        >
          <Award className="w-10 h-10 text-white" />
        </div>
        <span className="text-sm font-medium" style={{ color: medal.border }}>
          Medalla {medal.label}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-vu-accentLight text-7xl font-medium leading-none">{c}</p>
        <p className="text-vu-textSecondary text-sm mt-2">kg de CO₂ no emitidos</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm grid grid-cols-2 gap-3"
      >
        <div className="bg-vu-bgAlt rounded-xl p-4 flex flex-col items-center gap-2">
          <Car className="w-6 h-6 text-vu-accent" />
          <p className="text-vu-textPrimary text-xl font-medium">{full.equivalenceKmCar.toLocaleString()}</p>
          <p className="text-vu-textSecondary text-xs text-center">km no recorridos en carro</p>
        </div>
        <div className="bg-vu-bgAlt rounded-xl p-4 flex flex-col items-center gap-2">
          <Trees className="w-6 h-6 text-vu-accent" />
          <p className="text-vu-textPrimary text-xl font-medium">{full.equivalenceTrees}</p>
          <p className="text-vu-textSecondary text-xs text-center">árboles absorbiendo CO₂ un año</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm bg-vu-bgAlt rounded-xl p-4"
      >
        <p className="text-vu-textSecondary text-sm leading-relaxed text-center">
          Si cambias ahora, generarías{" "}
          <strong className="text-vu-warningLight">+{full.costOfChangeNow} kg de CO₂</strong>{" "}
          adicionales — {full.monthsEquivalent} meses más de uso.
        </p>
      </motion.div>
    </main>
  );
}

function RInner() {
  const params = useSearchParams();
  const raw = params.get("d");

  const data = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(atob(raw));
    } catch {
      return null;
    }
  }, [raw]);

  if (!data) {
    return (
      <main className="min-h-screen bg-vu-bg flex items-center justify-center">
        <p className="text-vu-textSecondary text-sm">Código inválido.</p>
      </main>
    );
  }

  return <ResultView m={data.m} y={data.y} c={data.c} x={data.x} />;
}

export default function RPage() {
  return <Suspense><RInner /></Suspense>;
}
