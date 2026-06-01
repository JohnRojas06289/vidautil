"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Recycle, Heart, ShoppingBag, ChevronRight, Leaf } from "lucide-react";
import { useVidaUtilStore } from "@/lib/store";

const OPTIONS = [
  {
    key: "reciclar",
    icon: Recycle,
    title: "Reciclar",
    subtitle: "El celular deja de existir como aparato",
    color: "#5DCAA5",
    steps: [
      "Borrá tus datos y hacé un restablecimiento de fábrica",
      "Llevalo a un punto de recolección certificado",
      "El fabricante recupera los materiales (litio, cobre, vidrio)",
    ],
    cta: "Puntos de reciclaje cercanos",
    note: "Elegí esta opción solo si el dispositivo ya no funciona.",
  },
  {
    key: "donar",
    icon: Heart,
    title: "Donar",
    subtitle: "La vida útil del celular continúa",
    color: "#F4D67E",
    steps: [
      "Verificá que funcione correctamente y cargue bien",
      "Restauralo a configuración de fábrica",
      "Contactá a un familiar, amigo o fundación tecnológica",
    ],
    cta: "Fundaciones que reciben dispositivos",
    note: "Cada año extra de vida evita ~65 kg de CO₂ de fabricación.",
  },
  {
    key: "vender",
    icon: ShoppingBag,
    title: "Vender",
    subtitle: "Extendés su vida y recuperás parte del valor",
    color: "#9FE1CB",
    steps: [
      "Tomá fotos del estado real del equipo",
      "Publicalo en plataformas de segunda mano",
      "Incluí accesorios originales para mejor precio",
    ],
    cta: "Consejos para vender tu celular",
    note: "Segunda mano es la opción con mayor impacto ambiental positivo.",
  },
];

export default function DescartePage() {
  const router = useRouter();
  const { footprint, phoneModelText } = useVidaUtilStore();

  return (
    <main id="main-content" className="min-h-dvh bg-vu-bg flex flex-col px-4 py-10 pb-safe">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Volver"
            className="p-2 rounded-xl bg-vu-bgAlt text-vu-textSecondary hover:text-vu-textPrimary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs uppercase tracking-widest text-vu-textSecondary">
            Guía de descarte
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-medium text-vu-textPrimary leading-tight">
            ¿Qué hacés con<br />tu {phoneModelText || "celular"}?
          </h1>
          <p className="text-vu-textSecondary text-sm mt-2">
            El destino que le des importa tanto como los años que lo usaste.
          </p>
        </motion.div>

        {/* Eco reminder */}
        {footprint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-vu-bgAlt rounded-xl px-4 py-3"
          >
            <Leaf className="w-4 h-4 text-vu-accent flex-shrink-0" />
            <p className="text-vu-textSecondary text-xs leading-relaxed">
              Tu {phoneModelText} tiene{" "}
              <strong className="text-vu-accentLight">{footprint.totalAvoidedCO2} kg de CO₂ evitados</strong>
              {" "}— el mejor final es que siga en uso.
            </p>
          </motion.div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-4">
          {OPTIONS.map(({ key, icon: Icon, title, subtitle, color, steps, cta, note }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              className="bg-vu-bgAlt rounded-2xl overflow-hidden"
            >
              {/* Option header */}
              <div className="flex items-center gap-4 px-5 pt-5 pb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}22` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="font-medium text-vu-textPrimary text-sm">{title}</p>
                  <p className="text-vu-textSecondary text-xs">{subtitle}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="px-5 pb-4 flex flex-col gap-2">
                {steps.map((s, si) => (
                  <div key={si} className="flex items-start gap-2.5">
                    <span
                      className="text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}33`, color }}
                    >
                      {si + 1}
                    </span>
                    <p className="text-vu-textSecondary text-xs leading-relaxed">{s}</p>
                  </div>
                ))}

                <p className="text-vu-textSecondary/50 text-xs mt-1 italic">{note}</p>

                <button className="flex items-center gap-1.5 mt-2" style={{ color }}>
                  <span className="text-xs font-medium">{cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-vu-textSecondary/40 text-xs text-center pb-4"
        >
          Evitá tirar el celular a la basura convencional — contiene materiales tóxicos que contaminan suelos y agua.
        </motion.p>

      </div>
    </main>
  );
}
