"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trash2, Share2 } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { MedalBadge } from "@/components/MedalBadge";
import { HuellaCounter } from "@/components/HuellaCounter";
import { EquivalenceCard } from "@/components/EquivalenceCard";

export default function HuellaPage() {
  const router = useRouter();
  const { phoneModelText, yearsOfUse, footprint, planChange } = useVidaUtilStore();

  useEffect(() => {
    if (!footprint || !phoneModelText) {
      router.replace("/");
      return;
    }
    // Haptic feedback: vibrate on medal reveal (tactile prototyping)
    if (navigator.vibrate) navigator.vibrate([80, 40, 120]);
  }, [footprint, phoneModelText, router]);

  async function handleShare() {
    const medal = footprint!.medal === "gold" ? "Oro" : footprint!.medal === "silver" ? "Plata" : "Bronce";
    const text = `🌿 Mi celular lleva ${yearsOfUse} ${yearsOfUse === 1 ? "año" : "años"} conmigo y ya evité ${footprint!.totalAvoidedCO2} kg de CO₂. Medalla ${medal} en VidaÚtil.`;
    if (navigator.share) {
      await navigator.share({ title: "VidaÚtil — Mi huella ambiental", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  if (!footprint || !phoneModelText) return null;

  return (
    <main id="main-content" className="min-h-dvh bg-vu-bg flex flex-col items-center px-4 py-10 pb-safe">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="p-2 rounded-xl bg-vu-bgAlt text-vu-textSecondary hover:text-vu-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase tracking-widest text-vu-textSecondary">Mi huella</span>
        </div>

        <p className="text-vu-textPrimary text-lg font-medium text-center">
          Tu celular lleva{" "}
          <span className="text-vu-accentLight">
            {yearsOfUse} {yearsOfUse === 1 ? "año" : "años"}
          </span>{" "}
          contigo
        </p>

        <div className="flex justify-center">
          <MedalBadge medal={footprint.medal} label={footprint.yearsBadgeLabel} delay={0} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <HuellaCounter value={footprint.totalAvoidedCO2} delay={0.4} />
        </motion.div>

        <EquivalenceCard
          kmCar={footprint.equivalenceKmCar}
          trees={footprint.equivalenceTrees}
          delay={0.6}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-vu-bgAlt rounded-xl p-4"
        >
          {planChange === "no" ? (
            <p className="text-vu-textSecondary text-sm leading-relaxed">
              Excelente decisión — cada año adicional que usás este celular evita{" "}
              <strong className="text-vu-accentLight">+{Math.round(footprint.annualFootprint)} kg de CO₂</strong>{" "}
              que generaría fabricar uno nuevo.
            </p>
          ) : planChange === "yes" ? (
            <p className="text-vu-textSecondary text-sm leading-relaxed">
              Si cambiás ahora, generarías{" "}
              <strong className="text-vu-warningLight">+{footprint.costOfChangeNow} kg de CO₂</strong>{" "}
              adicionales. Esperar{" "}
              <strong className="text-vu-warningLight">{footprint.monthsEquivalent} meses más</strong>{" "}
              compensaría esa huella por completo.
            </p>
          ) : (
            <p className="text-vu-textSecondary text-sm leading-relaxed">
              Si cambiás en el próximo año, generarías{" "}
              <strong className="text-vu-warningLight">+{footprint.costOfChangeNow} kg de CO₂</strong>{" "}
              adicionales — equivalente a{" "}
              <strong className="text-vu-warningLight">{footprint.monthsEquivalent} meses</strong>{" "}
              de uso del dispositivo que tenés.
            </p>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-3"
        >
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-vu-bgAlt text-vu-textSecondary text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
          <button
            onClick={() => router.push("/codigo")}
            className="flex-1 py-4 rounded-xl font-medium text-base bg-vu-accent text-vu-bg flex items-center justify-center gap-2"
          >
            Genera mi código
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* CTA secundario: guía de descarte (prominente si planean cambiarse) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          onClick={() => router.push("/descarte")}
          className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            planChange === "yes" || planChange === "maybe"
              ? "bg-vu-bgAlt border border-vu-accent/40 text-vu-textPrimary"
              : "bg-vu-bgAlt text-vu-textSecondary"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {planChange === "yes"
            ? "Ver guía de descarte responsable"
            : planChange === "maybe"
            ? "Conocé las opciones de descarte"
            : "¿Qué hacer cuando lo cambies?"}
        </motion.button>
      </div>
    </main>
  );
}
