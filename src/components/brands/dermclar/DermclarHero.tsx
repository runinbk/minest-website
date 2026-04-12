"use client";

import { ChevronDown } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow } from '@/lib/supabase';

interface DermclarHeroProps {
  brand: BrandRow | null;
}

export function DermclarHero({ brand }: DermclarHeroProps) {
  const { lang } = useBrandStore();
  const t = translations[lang].dermclar;
  const l = lang === 'ES' ? 'es' : 'en';

  const tagline = brand ? (l === 'es' ? brand.tagline_es : brand.tagline_en) : t.badge;
  const description = brand
    ? (l === 'es' ? brand.description_es : brand.description_en)
    : t.hero.description;

  return (
    <section
      id="hero"
      className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl w-full text-center space-y-6">
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-sm font-semibold tracking-wide uppercase">
          {tagline}
        </div>

        {/* Brand logo */}
        {brand?.logo_url && (
          <div className="flex justify-center -my-2 mb-2">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-16 md:h-20 w-auto object-contain drop-shadow-xl"
            />
          </div>
        )}

        {/* Headline */}
        <div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-none">
            {t.hero.title1}
          </h1>
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-[#38BDF8] tracking-tight leading-none">
            {t.hero.title2}
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-light leading-relaxed">
          {description}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#soluciones"
            className="px-8 py-4 bg-[#38BDF8] text-white rounded-full font-semibold shadow-xl shadow-[#38BDF8]/25 hover:scale-105 transition-transform"
          >
            {t.hero.cta1}
          </a>
          <a
            href="#contacto"
            className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/60 text-slate-900 rounded-full font-semibold hover:bg-white/60 transition-all"
          >
            {t.hero.cta2}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <ChevronDown className="w-6 h-6 text-slate-500 animate-bounce" />
      </div>
    </section>
  );
}
