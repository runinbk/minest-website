import { useState, useEffect } from 'react';

const MOBILE_THRESHOLD = 768;

/**
 * Returns true when window.innerWidth < 768px.
 * Initialises to false on SSR (no window), then syncs on mount and resize.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const check = (): void => {
      setIsMobile(window.innerWidth < MOBILE_THRESHOLD);
    };

    // Sync immediately after hydration
    check();

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}
