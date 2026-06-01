"use client";
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  value: number;
  delay?: number;
}

export function HuellaCounter({ value, delay = 0 }: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.5,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, delay, count, reduceMotion]);

  return (
    <div className="flex flex-col items-center gap-1" aria-live="polite" aria-atomic="true">
      <motion.span className="text-7xl font-medium text-vu-accentLight tabular-nums">
        {rounded}
      </motion.span>
      <span className="text-vu-textSecondary text-sm">kg de CO₂ no emitidos</span>
    </div>
  );
}
