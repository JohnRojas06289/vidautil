"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";
import { ArucoMarker } from "@/components/ArucoMarker";

export default function CodigoPage() {
  const router = useRouter();
  const { phoneModelText, yearsOfUse, footprint } = useVidaUtilStore();
  const [markerId, setMarkerId] = useState<number | null>(null);
  const [status, setStatus] = useState<"saving" | "ok" | "error">("saving");

  useEffect(() => {
    if (!footprint || !phoneModelText) {
      router.replace("/");
      return;
    }

    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelName: footprint.modelName,
        years: yearsOfUse,
        co2: footprint.totalAvoidedCO2,
        annualFootprint: footprint.annualFootprint,
        medal: footprint.medal,
        costOfChangeNow: footprint.costOfChangeNow,
        monthsEquivalent: footprint.monthsEquivalent,
        equivalenceKmCar: footprint.equivalenceKmCar,
        equivalenceTrees: footprint.equivalenceTrees,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setMarkerId(d.markerId);
          setStatus("ok");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [footprint, phoneModelText, yearsOfUse, router]);

  if (!footprint || !phoneModelText) return null;

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

        {status === "saving" && (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader2 className="w-8 h-8 text-vu-accent animate-spin" />
            <p className="text-vu-textSecondary text-sm">Generando tu código...</p>
          </div>
        )}

        {status === "ok" && markerId !== null && (
          <>
            <p className="text-vu-textSecondary text-sm text-center">
              Mostrá este código frente a la cámara del proyector
            </p>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <ArucoMarker markerId={markerId} size={260} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <p className="text-vu-textSecondary text-xs">Código</p>
              <p className="text-vu-accentLight text-4xl font-medium">{markerId}</p>
              <p className="text-vu-textSecondary/50 text-xs mt-1">
                {footprint.modelName} · {yearsOfUse} {yearsOfUse === 1 ? "año" : "años"}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-vu-textSecondary/50 text-xs text-center"
            >
              El código expira en 1 hora
            </motion.p>
          </>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-vu-warning text-sm text-center">
              No se pudo guardar la sesión. Verificá tu conexión e intentá de nuevo.
            </p>
            <button
              onClick={() => router.replace("/huella")}
              className="px-6 py-3 bg-vu-bgAlt rounded-xl text-vu-textSecondary text-sm"
            >
              Volver
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
