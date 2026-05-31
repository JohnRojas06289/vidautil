"use client";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Medal } from "@/lib/carbonCalc";

interface Props {
  medal: Medal;
  label: string;
  delay?: number;
}

const styles: Record<Medal, { bg: string; border: string; text: string }> = {
  bronze: { bg: "#A0522D", border: "#D4A574", text: "#F5DEB3" },
  silver: { bg: "#B4B2A9", border: "#D3D1C7", text: "#F0EDE8" },
  gold: { bg: "#D4AF37", border: "#F4D67E", text: "#FFF8E7" },
};

export function MedalBadge({ medal, label, delay = 0 }: Props) {
  const s = styles[medal];
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay }}
      className="flex flex-col items-center gap-3"
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: s.bg, border: `3px solid ${s.border}` }}
      >
        <Award className="w-12 h-12" style={{ color: s.text }} />
      </div>
      <span className="text-sm font-medium text-vu-textSecondary">{label}</span>
    </motion.div>
  );
}
