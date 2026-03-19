
import { create } from 'zustand';

export type BrandType = 'maines' | 'dermclar' | 'xtralife' | 'jetema';
export type LanguageType = 'ES' | 'EN';

interface BrandState {
  activeBrand: BrandType;
  setActiveBrand: (brand: BrandType) => void;
  isBrandSectionInView: boolean;
  setIsBrandSectionInView: (inView: boolean) => void;
  lang: LanguageType;
  setLang: (lang: LanguageType) => void;
}

export const useBrandStore = create<BrandState>((set) => ({
  activeBrand: 'maines',
  setActiveBrand: (brand) => set({ activeBrand: brand }),
  isBrandSectionInView: false,
  setIsBrandSectionInView: (inView) => set({ isBrandSectionInView: inView }),
  lang: 'ES',
  setLang: (lang) => set({ lang }),
}));
