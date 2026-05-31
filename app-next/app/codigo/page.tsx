"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, ArrowRight, Monitor } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { FiducialMarker } from "@/components/FiducialMarker";

function generateUserId(): string {
  return "anon-" + Math.random().toString(36).slice(2, 6);
}

export default function CodigoPage() {
  const router = useRouter();
  const { selectedPhone, yearsOfUse, footprint, markerId } = useVidaUtilStore();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");

  useEffect(() => {
    if (!footprint || !selectedPhone || markerId === null) {
      router.replace("/");
      return;
    }

    setSaveStatus("saving");
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: generateUserId(),
        phoneModel: selectedPhone.model,
        yearsOfUse,
        annualFootprint: footprint.annualFootprint,
        totalAvoidedCO2: footprint.totalAvoidedCO2,
        costOfChangeNow: footprint.costOfChangeNow,
        monthsEquivalent: footprint.monthsEquivalent,
        medal: footprint.medal,
        markerId,
      }),
    })
      .then((r) => r.json())
      .then((d) => setSaveStatus(d.ok ? "ok" : "error"))
      .catch(() => setSaveStatus("error"));
  }, [footprint, selectedPhone, yearsOfUse, markerId, router]);

  if (!footprint || !selectedPhone || markerId === null) return null;

  return (
    <main className="min-h-screen bg-vu-bg flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-8 items-center">
        <div className="w-full flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-vu-bgAlt text-vu-textSecondary hover:text-vu-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase tracking-widest text-vu-textSecondary">
            Tu código personal
          </span>
        </div>

        <p className="text-vu-textSecondary text-sm text-center">
          Apunta este código a la cámara para revelarlo todo
        </p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <FiducialMarker markerId={markerId} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 text-vu-textSecondary"
        >
          <Camera className="w-6 h-6 text-vu-accent" />
          <ArrowRight className="w-4 h-4" />
          <Monitor className="w-6 h-6 text-vu-accentLight" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-vu-textSecondary text-sm text-center leading-relaxed max-w-xs"
        >
          Sostén tu celular con esta imagen visible hacia la cámara. La instalación te mostrará
          tu huella ambiental cobrando vida.
        </motion.p>

        {saveStatus === "error" && (
          <p className="text-vu-warning text-xs text-center">
            No se pudo conectar con la instalación. La experiencia web sigue disponible.
          </p>
        )}
        {saveStatus === "ok" && (
          <p className="text-vu-accentLight text-xs text-center">
            Datos sincronizados con la instalación.
          </p>
        )}
      </div>
    </main>
  );
}
