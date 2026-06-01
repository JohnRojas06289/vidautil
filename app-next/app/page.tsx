"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Monitor, ChevronLeft } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { calculateFootprint, findPhoneByText } from "@/lib/carbonCalc";

// ─── Popular phones (chips de selección rápida) ───────────────────────────────
const POPULAR = [
  "iPhone 13", "iPhone 14", "iPhone 15",
  "Galaxy S23", "Galaxy A52",
  "Redmi Note 11", "Moto G60",
];

// ─── Background particles ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.5 + 3) % 100}%`,
  size: 12 + (i % 5) * 10,
  duration: `${8 + (i % 7) * 2.5}s`,
  delay: `${(i * 0.9) % 6}s`,
}));

// ─── Live CO₂ estimate ────────────────────────────────────────────────────────
function useLiveCO2(model: string, years: number) {
  return useMemo(() => {
    if (!model || years < 1) return null;
    const phone = findPhoneByText(model);
    return calculateFootprint(phone, years, model);
  }, [model, years]);
}

// ─── Animated counter ────────────────────────────────────────────────────────
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    const steps = 40;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplay(Math.round(start + diff * (i / steps)));
      if (i >= steps) { clearInterval(timer); prev.current = value; }
    }, 18);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}</>;
}

// ─── Slide variants ───────────────────────────────────────────────────────────
const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { setPhoneText, setYears, setFootprint } = useVidaUtilStore();

  const [step, setStep] = useState(0);         // 0=intro 1=phone 2=years
  const [dir, setDir] = useState(1);
  const [phone, setPhone] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [years, setYearsLocal] = useState(0);

  const activePhone = phone === "__other__" ? customPhone : phone;
  const live = useLiveCO2(activePhone, years);

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function selectPhone(name: string) {
    setPhone(name);
    setTimeout(() => go(2), 180);
  }

  function selectYears(y: number) {
    setYearsLocal(y);
  }

  function handleSubmit() {
    if (!live) return;
    setPhoneText(activePhone);
    setYears(years);
    setFootprint(live);
    router.push("/huella");
  }

  return (
    <div className="relative min-h-screen bg-vu-bg overflow-hidden flex flex-col">

      {/* ── Floating particle background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: "-10%",
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: live ? 0.25 + (live.totalAvoidedCO2 / 200) : 0.12,
            }}
          />
        ))}
      </div>

      {/* ── Steps ── */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>

          {/* STEP 0 — Intro */}
          {step === 0 && (
            <motion.div
              key="intro"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-8"
            >
              <div className="text-center flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-vu-accent flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-vu-bg fill-current">
                    <path d="M17 8C8 10 5.9 16.17 3.82 20.32L5.71 21l1-2.3A4.49 4.49 0 0 0 8 19c8 0 10-8 10-8s-2 2-4 2c0 0 3-3 3-7z"/>
                  </svg>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h1 className="text-4xl font-medium text-vu-textPrimary leading-tight">
                    VidaÚtil
                  </h1>
                  <p className="text-vu-accentLight text-lg mt-1 italic">
                    Premia lo que ya haces bien
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-vu-textSecondary text-sm leading-relaxed max-w-xs text-center"
                >
                  El 85–95% del impacto ambiental de tu celular está en su fabricación — no en su uso. Descubrí cuánto CO₂ ya evitaste.
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => go(1)}
                className="flex items-center gap-3 bg-vu-accent text-vu-bg px-8 py-4 rounded-2xl text-base font-medium"
              >
                Descubrir mi impacto
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => router.push("/proyector")}
                className="flex items-center gap-2 text-vu-textSecondary text-sm"
              >
                <Monitor className="w-4 h-4" />
                Abrir proyector
              </motion.button>
            </motion.div>
          )}

          {/* STEP 1 — Phone */}
          {step === 1 && (
            <motion.div
              key="phone"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute inset-0 flex flex-col px-6 pt-16 pb-8 gap-8 overflow-y-auto"
            >
              <button onClick={() => go(0)} className="flex items-center gap-1 text-vu-textSecondary text-sm w-fit">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>

              <div>
                <p className="text-vu-textSecondary text-xs uppercase tracking-widest mb-2">Paso 1 de 2</p>
                <h2 className="text-3xl font-medium text-vu-textPrimary leading-tight">
                  ¿Cuál es<br />tu celular?
                </h2>
              </div>

              {/* Popular chips */}
              <div className="grid grid-cols-2 gap-3">
                {POPULAR.map((name) => (
                  <motion.button
                    key={name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectPhone(name)}
                    className={`py-4 px-4 rounded-2xl text-sm font-medium text-left transition-all ${
                      phone === name
                        ? "bg-vu-accent text-vu-bg"
                        : "bg-vu-bgAlt text-vu-textPrimary"
                    }`}
                  >
                    {name}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhone("__other__")}
                  className={`py-4 px-4 rounded-2xl text-sm font-medium text-left col-span-2 transition-all ${
                    phone === "__other__"
                      ? "bg-vu-bgAlt border border-vu-accent text-vu-textPrimary"
                      : "bg-vu-bgAlt text-vu-textSecondary"
                  }`}
                >
                  Otro modelo...
                </motion.button>
              </div>

              <AnimatePresence>
                {phone === "__other__" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="ej. Galaxy S21, Redmi 9..."
                      className="w-full bg-vu-bg text-vu-textPrimary placeholder-vu-textSecondary/40 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vu-accent"
                    />
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => customPhone.trim() && go(2)}
                      disabled={!customPhone.trim()}
                      className="mt-3 w-full py-4 rounded-xl bg-vu-accent text-vu-bg font-medium text-sm disabled:opacity-40"
                    >
                      Continuar
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 2 — Years */}
          {step === 2 && (
            <motion.div
              key="years"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="absolute inset-0 flex flex-col px-6 pt-12 pb-6 gap-4 overflow-y-auto"
            >
              <button onClick={() => go(1)} className="flex items-center gap-1 text-vu-textSecondary text-sm w-fit">
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>

              <div>
                <p className="text-vu-textSecondary text-xs uppercase tracking-widest mb-1">Paso 2 de 2</p>
                <h2 className="text-2xl font-medium text-vu-textPrimary leading-tight">
                  ¿Cuántos años llevas con él?
                </h2>
              </div>

              {/* Year buttons — fijos, compactos */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                  <motion.button
                    key={y}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectYears(y)}
                    className={`h-14 rounded-xl text-xl font-medium transition-all flex items-center justify-center ${
                      years === y
                        ? "bg-vu-accent text-vu-bg"
                        : "bg-vu-bgAlt text-vu-textPrimary"
                    }`}
                  >
                    {y === 8 ? "8+" : y}
                  </motion.button>
                ))}
              </div>

              {/* Live CO₂ preview */}
              <AnimatePresence mode="wait">
                {live && years > 0 ? (
                  <motion.div
                    key={years}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-vu-bgAlt rounded-2xl p-5 flex flex-col items-center gap-1"
                  >
                    <p className="text-vu-textSecondary text-xs uppercase tracking-widest">Ya evitaste</p>
                    <p className="text-5xl font-medium text-vu-accentLight leading-none">
                      <CountUp value={live.totalAvoidedCO2} />
                    </p>
                    <p className="text-vu-textSecondary text-sm">kg de CO₂</p>
                    <p className="text-vu-textSecondary/60 text-xs mt-1">
                      Medalla {live.medal === "gold" ? "Oro" : live.medal === "silver" ? "Plata" : "Bronce"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="bg-vu-bgAlt/40 rounded-2xl p-5 flex items-center justify-center"
                  >
                    <p className="text-vu-textSecondary/40 text-sm">Seleccioná un año para ver tu impacto</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={years < 1}
                className="w-full py-4 rounded-2xl bg-vu-accent text-vu-bg font-medium text-base disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Ver mi huella completa
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Step dots ── */}
      {step > 0 && (
        <div className="relative z-10 flex justify-center gap-2 pb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? "w-6 bg-vu-accent" : "w-1.5 bg-vu-bgAlt"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
