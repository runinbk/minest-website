"use client";

import { useEffect } from 'react';
import { useBrandStore, BrandType } from '@/store/useBrandStore';

interface BrandInitializerProps {
  brand: BrandType;
}

/**
 * Invisible client component that syncs the Zustand store's activeBrand
 * with the current sub-brand page. Resets to 'maines' on unmount.
 */
export function BrandInitializer({ brand }: BrandInitializerProps) {
  const setActiveBrand = useBrandStore((s) => s.setActiveBrand);

  useEffect(() => {
    setActiveBrand(brand);
    return () => setActiveBrand('maines');
  }, [brand, setActiveBrand]);

  return null;
}
