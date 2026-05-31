"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useVidaUtilStore } from "@/lib/store";

export default function CodigoPage() {
  const router = useRouter();
  const { phoneModelText, yearsOfUse, footprint } = useVidaUtilStore();
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (!footprint || !phoneModelText) {
      router.replace("/");
      return;
    }

    const payload = {
      m: footprint.modelName,
      y: yearsOfUse,
      co2: footprint.totalAvoidedCO2,
      af: footprint.annualFootprint,
      cost: footprint.costOfChangeNow,
      months: footprint.monthsEquivalent,
      medal: footprint.medal,
      km: footprint.equivalenceKmCar,
      trees: footprint.equivalenceTrees,
    };

    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const origin = window.location.origin;
    setQrUrl(`${origin}/resultado?d=${base64}`);
  }, [footprint, phoneModelText, yearsOfUse, router]);

  if (!footprint || !phoneModelText || !qrUrl) return null;

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
          Escanea este código desde el computador para ver tu huella cobrar vida
        </p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="bg-white p-5 rounded-2xl"
        >
          <QRCodeSVG value={qrUrl} size={260} bgColor="#ffffff" fgColor="#000000" level="M" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-vu-textSecondary text-xs text-center opacity-60"
        >
          {footprint.modelName} · {yearsOfUse} {yearsOfUse === 1 ? "año" : "años"} contigo
        </motion.p>
      </div>
    </main>
  );
}
