"use client";
import { motion } from "framer-motion";
import { Car, Trees } from "lucide-react";

interface Props {
  kmCar: number;
  trees: number;
  delay?: number;
}

export function EquivalenceCard({ kmCar, trees, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-vu-bgAlt border-l-4 border-vu-accent rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <Car className="w-5 h-5 text-vu-accent flex-shrink-0" />
        <span className="text-vu-textPrimary text-sm">
          <strong className="text-vu-accentLight">{kmCar.toLocaleString("es-CO")} km</strong>{" "}
          no recorridos en carro
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Trees className="w-5 h-5 text-vu-accent flex-shrink-0" />
        <span className="text-vu-textPrimary text-sm">
          <strong className="text-vu-accentLight">{trees}</strong>{" "}
          {trees === 1 ? "árbol absorbiendo" : "árboles absorbiendo"} CO₂ un año entero
        </span>
      </div>
    </motion.div>
  );
}
