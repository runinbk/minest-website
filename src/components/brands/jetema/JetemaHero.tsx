'use client';

import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/useIsMobile';

// Dynamic import — ssr:false is already set inside JetemaHeroCanvas itself,
// but wrapping here as well ensures Next.js never tries to render it on the server.
const JetemaHeroCanvas = dynamic(
  () => import('@/components/3d/JetemaHeroCanvas'),
  { ssr: false },
);

interface JetemaHeroProps {
  brand: BrandRow | null;
}

export function JetemaHero({ brand }: JetemaHeroProps) {
  const { lang }   = useBrandStore();
  const t          = translations[lang].jetema;
  const l          = lang === 'ES' ? 'es' : 'en';
  const isMobile   = useIsMobile();

  const tagline    = brand ? (l === 'es' ? brand.tagline_es    : brand.tagline_en)    : t.badge;
  const description = brand ? (l === 'es' ? brand.description_es : brand.description_en) : t.hero.description;

  return (
    <section
      id="hero"
      className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Mobile: fallback image behind text at low opacity ──────────────── */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
          <img
            src="/images/jetema-fallback.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* ── Desktop: 3-D canvas anchored to the right 45 % ─────────────────── */}
      {!isMobile && (
        <div className="absolute top-0 right-0 w-[45%] h-full pointer-events-none z-0">
          <JetemaHeroCanvas />
        </div>
      )}

      {/* ── Text content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl w-full">
        {/*
          On desktop the text sits left-aligned in roughly the left 55 %.
          On mobile it's centred over the faint fallback image.
        */}
        <div className="max-w-xl space-y-6 md:text-left text-center">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-600 text-sm font-semibold tracking-wide uppercase">
            {tagline}
          </div>

          {/* Brand logo */}
          {brand?.logo_url && (
            <div className="flex md:justify-start justify-center">
              <div className="bg-white/60 backdrop-blur-sm px-8 py-4 rounded-3xl shadow-lg border border-white/60">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Headline */}
          <div>
            <h1 className="font-headline text-6xl md:text-8xl font-bold text-slate-900 tracking-tight leading-none">
              {t.hero.title1}
            </h1>
            <h1 className="font-headline text-6xl md:text-8xl font-bold text-purple-600 tracking-tight leading-none">
              {t.hero.title2}
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap md:justify-start justify-center gap-4 pt-2">
            <a
              href="#catalogo"
              className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform"
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
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <ChevronDown className="w-6 h-6 text-slate-500 animate-bounce" />
      </div>
    </section>
  );
}
