'use client';

import { useRef } from 'react';
import Lenis from 'lenis';
import { gsap, useGSAP } from '@/lib/gsap-setup';

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * Initialises Lenis smooth-scroll and drives it via the GSAP ticker.
 * Only active on desktop (window.innerWidth >= 768).
 *
 * Uses useGSAP (not useEffect) to comply with project GSAP rules — ticker
 * management is GSAP infrastructure and must share the same cleanup lifecycle.
 * No `scope` is passed because we target no DOM elements with selectors.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useGSAP(() => {
    // Skip on SSR and on touch devices
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    // Pipe Lenis RAF into GSAP's ticker so both are in perfect sync
    const onTick = (time: number): void => {
      lenis.raf(time * 1000); // GSAP time is seconds; Lenis expects ms
    };

    gsap.ticker.add(onTick);
    // Prevent GSAP from artificially capping deltaTime after tab focus
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }); // no dependency array → runs once on mount, cleans up on unmount

  return <>{children}</>;
}
