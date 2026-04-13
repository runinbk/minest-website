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
          <div className="flex justify-center -my-2 mb-4">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-32 md:h-48 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Headline */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight leading-snug">
            {t.hero.title1} <span className="text-[#38BDF8] dark:text-[#7dd3fc]">{t.hero.title2}</span>
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
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
            className="px-8 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-900 dark:text-white rounded-full font-semibold hover:bg-white/60 dark:hover:bg-slate-800/80 transition-all"
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
