'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Brand palette ─────────────────────────────────────────────────────────
const brandColors: Record<string, string> = {
  '/': '#1B3A6B',
  '/jetema': '#0D0D0D',
  '/dermclar': '#38BDF8',
  '/xtralife': '#06752E',
};

// ─── Curtain variants ───────────────────────────────────────────────────────
//
// Two-layer strategy — solves the transformOrigin conflict:
//   • Cover layer   (z-9998): scaleY 0→1 from bottom  (enters from below)
//   • Uncover layer (z-9999): scaleY 1→0 from top     (exits upward, reveals new page)
//
// Both layers share the brand color. The cover layer exits instantly (no visual
// gap) while the uncover layer slides away, creating a seamless cover→reveal.

const coverVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    // No visual exit — uncover layer is already on top at z-9999
    scaleY: 1,
    transition: { duration: 0 },
  },
};

const uncoverVariants = {
  // Starts fully covering the screen
  hidden: { scaleY: 1 },
  visible: {
    scaleY: 1,
    transition: { duration: 0 }, // snap to covered state instantly
  },
  exit: {
    scaleY: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Content variants ───────────────────────────────────────────────────────
//
// Content fades in at delay 0.4s — timed to start appearing as the uncover
// layer is sliding away, so the page is already visible when fully revealed.

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, delay: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

// ─── Transition timing ──────────────────────────────────────────────────────
//
// Cover animation takes 0.5s. We show the curtain for 0.6s before triggering
// the uncover exit, giving a 100ms buffer after full coverage.

const COVER_DURATION_MS = 600;

// ─── Component ──────────────────────────────────────────────────────────────

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Colour is derived from the INCOMING route
  const color = brandColors[pathname] ?? '#1B3A6B';

  // isCovering: true  → curtain layers mount and cover
  // isCovering: false → curtain layers exit, revealing new content
  const [isCovering, setIsCovering] = useState(true);

  // curtainKey increments on every navigation, forcing AnimatePresence to
  // treat each curtain cycle as a fresh element even on same-route transitions.
  const [curtainKey, setCurtainKey] = useState(0);

  useEffect(() => {
    setIsCovering(true);
    setCurtainKey((k) => k + 1);

    const timer = setTimeout(() => setIsCovering(false), COVER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* ── Cover layer: slides in from bottom ──────────────────────────── */}
      <AnimatePresence>
        {isCovering && (
          <motion.div
            key={`cover-${curtainKey}`}
            variants={coverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-none fixed inset-0 z-[9998]"
            style={{ backgroundColor: color, transformOrigin: 'bottom' }}
          />
        )}
      </AnimatePresence>

      {/* ── Uncover layer: slides away from top ─────────────────────────── */}
      <AnimatePresence>
        {isCovering && (
          <motion.div
            key={`uncover-${curtainKey}`}
            variants={uncoverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-none fixed inset-0 z-[9999]"
            style={{ backgroundColor: color, transformOrigin: 'top' }}
          />
        )}
      </AnimatePresence>

      {/* ── Page content ────────────────────────────────────────────────── */}
      {/*
        AnimatePresence mode="wait" ensures the exiting page's opacity-0
        animation completes before the entering page starts fading in.
        The curtain covers this swap entirely — users never see the gap.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
