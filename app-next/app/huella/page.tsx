"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { MedalBadge } from "@/components/MedalBadge";
import { HuellaCounter } from "@/components/HuellaCounter";
import { EquivalenceCard } from "@/components/EquivalenceCard";

export default function HuellaPage() {
  const router = useRouter();
  const { selectedPhone, yearsOfUse, footprint } = useVidaUtilStore();

  useEffect(() => {
    if (!footprint || !selectedPhone) {
      router.replace("/");
    }
  }, [footprint, selectedPhone, router]);

  if (!footprint || !selectedPhone) return null;

  return (
    <main className="min-h-screen bg-vu-bg flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
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
          <p className="text-vu-textSecondary text-sm leading-relaxed">
            Si cambias ahora, generarías{" "}
            <strong className="text-vu-warningLight">+{footprint.costOfChangeNow} kg de CO₂</strong>{" "}
            adicionales — equivalente a{" "}
            <strong className="text-vu-warningLight">{footprint.monthsEquivalent} meses</strong>{" "}
            de uso del dispositivo que tienes.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => router.push("/codigo")}
          className="w-full py-4 rounded-xl font-medium text-base bg-vu-accent text-vu-bg hover:bg-vu-accentLight transition-colors flex items-center justify-center gap-2"
        >
          Genera mi código
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </main>
  );
}
