"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { ArucoMarker } from "@/components/ArucoMarker";

export default function CodigoPage() {
  const router = useRouter();
  const { phoneModelText, yearsOfUse, footprint } = useVidaUtilStore();

  // Encode session data directly in the QR — no API, no KV needed
  const qrValue = useMemo(() => {
    if (!footprint) return null;
    const payload = {
      m: footprint.modelName,
      y: yearsOfUse,
      c: footprint.totalAvoidedCO2,
      a: footprint.annualFootprint,
      x: footprint.medal,
    };
    return btoa(JSON.stringify(payload));
  }, [footprint, yearsOfUse]);

  if (!footprint || !phoneModelText) {
    router.replace("/");
    return null;
  }

  return (
    <main id="main-content" className="min-h-dvh bg-vu-bg flex flex-col items-center px-4 py-10 pb-safe">
      <div className="w-full max-w-md flex flex-col gap-8 items-center">

        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="p-2 rounded-xl bg-vu-bgAlt text-vu-textSecondary hover:text-vu-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase tracking-widest text-vu-textSecondary">
            Tu código personal
          </span>
        </div>

        <p className="text-vu-textSecondary text-sm text-center">
          Mostrá este código frente a la cámara del proyector
        </p>

        {qrValue && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <ArucoMarker value={qrValue} size={260} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="text-vu-textSecondary text-xs">{footprint.modelName}</p>
          <p className="text-vu-accentLight text-4xl font-medium">
            {footprint.totalAvoidedCO2}
          </p>
          <p className="text-vu-textSecondary text-xs">kg CO₂ evitados</p>
          <p className="text-vu-textSecondary/50 text-xs mt-1">
            {yearsOfUse} {yearsOfUse === 1 ? "año" : "años"} de uso
          </p>
        </motion.div>

      </div>
    </main>
  );
}
