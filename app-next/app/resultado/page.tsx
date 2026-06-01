"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Award, Car, Trees } from "lucide-react";

interface ResultData {
  m: string;
  y: number;
  co2: number;
  af: number;
  cost: number;
  months: number;
  medal: "bronze" | "silver" | "gold";
  km: number;
  trees: number;
}

const MEDAL_COLORS = {
  bronze: { bg: "#A0522D", border: "#D4A574", label: "Bronce" },
  silver: { bg: "#B4B2A9", border: "#D3D1C7", label: "Plata" },
  gold:   { bg: "#D4AF37", border: "#F4D67E", label: "Oro" },
};

function Particle({ x, y, size, duration, delay, color }: {
  x: number; y: number; size: number; duration: number; delay: number; color: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, backgroundColor: color, opacity: 0 }}
      animate={{ y: -180, opacity: [0, 0.4, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function Cloud({ annualFootprint }: { annualFootprint: number }) {
  const count = Math.round(Math.min(Math.max(annualFootprint / 5, 4), 18));
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 120 + Math.sin(i * 2.4) * 60,
      y: 260 + Math.cos(i * 1.7) * 20,
      size: 30 + (i % 4) * 12,
      duration: 2.5 + (i % 5) * 0.4,
      delay: (i * 0.3) % 2.5,
      color: i % 5 === 0 ? "#9FE1CB" : "#5DCAA5",
    })),
  [count]);

  return (
    <div className="relative w-72 h-80 mx-auto">
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
      {/* Phone silhouette */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-44 rounded-2xl border-2 border-vu-textPrimary/60 flex flex-col items-center justify-start pt-3 gap-1">
        <div className="w-8 h-1 rounded-full bg-vu-textSecondary/40" />
        <div className="w-2 h-2 rounded-full bg-vu-textSecondary/30 mt-1" />
      </div>
    </div>
  );
}

function ResultView({ data }: { data: ResultData }) {
  const medal = MEDAL_COLORS[data.medal];

  return (
    <main id="main-content" className="min-h-screen bg-vu-bg flex flex-col items-center px-6 py-12 gap-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-vu-textSecondary text-xs uppercase tracking-widest mb-1">Tu huella</p>
        <h1 className="text-vu-textPrimary text-2xl font-medium">{data.m}</h1>
        <p className="text-vu-textSecondary text-sm mt-1">
          {data.y} {data.y === 1 ? "año" : "años"} contigo
        </p>
      </div>

      {/* Medal */}
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

      {/* CO2 cloud */}
      <Cloud annualFootprint={data.af} />

      {/* Hero number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center -mt-8"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-vu-accentLight text-7xl font-medium leading-none">{data.co2}</p>
        <p className="text-vu-textSecondary text-sm mt-2">kg de CO₂ no emitidos</p>
      </motion.div>

      {/* Equivalences */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm grid grid-cols-2 gap-3"
      >
        <div className="bg-vu-bgAlt rounded-xl p-4 flex flex-col items-center gap-2">
          <Car className="w-6 h-6 text-vu-accent" />
          <p className="text-vu-textPrimary text-xl font-medium">{data.km.toLocaleString()}</p>
          <p className="text-vu-textSecondary text-xs text-center">km no recorridos en carro</p>
        </div>
        <div className="bg-vu-bgAlt rounded-xl p-4 flex flex-col items-center gap-2">
          <Trees className="w-6 h-6 text-vu-accent" />
          <p className="text-vu-textPrimary text-xl font-medium">{data.trees}</p>
          <p className="text-vu-textSecondary text-xs text-center">árboles absorbiendo CO₂ un año</p>
        </div>
      </motion.div>

      {/* Cost of change */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm bg-vu-bgAlt rounded-xl p-4"
      >
        <p className="text-vu-textSecondary text-sm leading-relaxed text-center">
          Si cambias ahora, generarías{" "}
          <strong className="text-vu-warningLight">+{data.cost} kg de CO₂</strong>{" "}
          adicionales — {data.months} meses más de uso del dispositivo que tienes.
        </p>
      </motion.div>
    </main>
  );
}

function ResultadoInner() {
  const params = useSearchParams();
  const raw = params.get("d");

  const data = useMemo<ResultData | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(escape(atob(raw))));
    } catch {
      return null;
    }
  }, [raw]);

  if (!data) {
    return (
      <main className="min-h-screen bg-vu-bg flex items-center justify-center">
        <p className="text-vu-textSecondary text-sm">Código inválido o expirado.</p>
      </main>
    );
  }

  return <ResultView data={data} />;
}

export default function ResultadoPage() {
  return (
    <Suspense>
      <ResultadoInner />
    </Suspense>
  );
}
