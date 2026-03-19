"use client";

import { motion } from 'framer-motion';
import { useBrandStore, BrandType } from '@/store/useBrandStore';

const brandColors: Record<BrandType, { primary: string; secondary: string }> = {
  maines: { primary: '#94A3B8', secondary: '#CBD5E1' }, // Slate/Silver
  dermclar: { primary: '#60a5fa', secondary: '#67e8f9' }, // Blue/Cyan
  xtralife: { primary: '#34d399', secondary: '#bef264' }, // Emerald/Lime
  jetema: { primary: '#c084fc', secondary: '#f472b6' }, // Purple/Fuchsia
};

export function AuroraBackground() {
  const activeBrand = useBrandStore((state) => state.activeBrand);
  const colors = brandColors[activeBrand];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-stone-50">
      <motion.div
        animate={{
          backgroundColor: colors.primary,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-20"
      />
      <motion.div
        animate={{
          backgroundColor: colors.secondary,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-[0.15]"
      />
      <motion.div
        animate={{
          backgroundColor: colors.primary,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute -bottom-[10%] left-[20%] w-[55vw] h-[55vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-20"
      />
    </div>
  );
}
