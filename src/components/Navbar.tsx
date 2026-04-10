"use client";

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useBrandStore } from '@/store/useBrandStore';
import { cn } from '@/lib/utils';
import { Activity, ShieldCheck, HeartPulse, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { translations } from '@/lib/translations';

const brands = [
  { id: 'dermclar', label: 'Dermclar', icon: Activity },
  { id: 'xtralife', label: 'Xtralife', icon: ShieldCheck },
  { id: 'jetema', label: 'Jetema', icon: HeartPulse },
] as const;

interface NavbarProps {
  logoUrl?: string;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const { activeBrand, setActiveBrand, isBrandSectionInView, lang, setLang } = useBrandStore();
  const logoSrc = logoUrl || 'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/logomainesENV06.png';
  const t = translations[lang].nav;

  // Lógica de scroll para ocultar narvar al bajar y mostrar al subir
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous! && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { label: t.about, href: "#nosotros" },
    { label: t.brands, href: "#marcas" },
    { label: t.contact, href: "#contacto" },
  ];

  return (
    <>
      <AnimatePresence>
        {!isBrandSectionInView && (
          <motion.nav
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: hidden ? -100 : 0, x: '-50%', opacity: hidden ? 0 : 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                className="h-8 w-auto"
                alt="Maines"
              />
              <span className="text-xl font-bold text-yellow-600 tracking-tight hidden sm:inline-block">Maines S.R.L.</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
                className="hidden sm:block px-6 py-2 bg-white/10 rounded-full text-sm font-bold text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                {lang} | {lang === 'ES' ? 'EN' : 'ES'}
              </button>
              
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 text-slate-600">
                      <Menu className="w-6 h-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-[#0B152A]/95 backdrop-blur-xl border-l border-white/10">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation Menu</SheetTitle>
                      <SheetDescription>Access Maines corporate sections</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 mt-12">
                      <div className="flex items-center gap-2 mb-4">
                        <img src={logoSrc} className="h-10 w-auto" alt="Maines" />
                        <span className="text-lg font-bold text-yellow-600">Maines S.R.L.</span>
                      </div>
                      {navLinks.map((item) => (
                        <a key={item.label} href={item.href} className="text-2xl font-headline font-bold text-white text-left">
                          {item.label}
                        </a>
                      ))}
                      <button 
                        onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
                        className="w-full bg-white/10 text-white hover:bg-white/20 py-4 rounded-2xl font-bold mt-4 transition-colors"
                      >
                        {lang} | {lang === 'ES' ? 'EN' : 'ES'}
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBrandSectionInView && (
          <motion.nav
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: hidden ? -100 : 24, x: '-50%', opacity: hidden ? 0 : 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center gap-1"
          >
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300",
                  activeBrand === brand.id ? "text-white" : "text-slate-300 hover:bg-white/10"
                )}
              >
                {activeBrand === brand.id && (
                  <motion.div
                    layoutId="activeBrandPill"
                    className="absolute inset-0 bg-primary rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <brand.icon className={cn("w-4 h-4 z-10", activeBrand === brand.id ? "text-white" : "text-slate-400")} />
                <span className="z-10">{brand.label}</span>
              </button>
            ))}
            <div className="w-px h-6 bg-slate-700 mx-2" />
            <button 
              onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
              className="px-4 py-2 text-xs md:text-sm font-bold text-white hover:text-slate-300 transition-colors"
            >
              {lang} | {lang === 'ES' ? 'EN' : 'ES'}
            </button>
            <button 
              onClick={() => setActiveBrand('maines')}
              className="ml-1 p-2.5 hover:bg-white/40 rounded-full transition-colors flex items-center gap-2"
              title={t.backToMaines}
            >
              <img src={logoSrc} className="h-5 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" alt="Maines" />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
