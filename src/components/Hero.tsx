'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Layers, MapPin } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { gsap, useGSAP } from '@/lib/gsap-setup';

interface HeroProps {
  siteConfig: Record<string, { es: string; en: string }>;
}

const fallback = {
  headline: { es: 'Maines SRL.', en: 'Maines SRL.' },
  subheadline: {
    es: 'Importamos y distribuimos las marcas más innovadoras para Bolivia',
    en: 'We import the most innovative brands for Bolivia',
  },
  cta: { es: 'Conocé nuestras marcas', en: 'Discover our brands' },
};

export function Hero({ siteConfig }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { lang } = useBrandStore();
  const l = lang === 'ES' ? 'es' : 'en';

  const headline    = siteConfig['hero_headline']?.[l]    ?? fallback.headline[l];
  const subheadline = siteConfig['hero_subheadline']?.[l] ?? fallback.subheadline[l];
  const cta         = siteConfig['hero_cta']?.[l]         ?? fallback.cta[l];

  // Each word becomes a span animated by GSAP — framer-motion is NOT on these spans
  const words = subheadline.split(' ');

  const stats = [
    { icon: Calendar, value: '+10', text: lang === 'ES' ? 'Años de experiencia' : 'Years of experience' },
    { icon: Layers,   value: '3',   text: lang === 'ES' ? 'Marcas Premium' : 'Premium Brands' },
    { icon: MapPin,   value: 'SCZ', text: 'Bolivia' },
  ];

  // ─── GSAP: title word stagger + stat entrance ────────────────────────────
  useGSAP(
    () => {
      // Timeline for the word-split subheadline
      // Each .hero-word span animates autoAlpha 0→1, y 30→0 with stagger 0.08
      gsap.timeline({ delay: 0.4 }).fromTo(
        '.hero-word',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out' },
      );

      // Stat cards: stagger entrance from opacity 0
      // GSAP targets the outer .hero-stat wrappers; framer-motion handles the
      // inner motion.div y-float independently — no transform conflict.
      gsap.fromTo(
        '.hero-stat',
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: 0.15, duration: 0.8, delay: 0.9, ease: 'power2.out' },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center"
    >
      <div className="max-w-5xl w-full text-center space-y-5 relative">
        {/* Badge — framer-motion entrance kept as-is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase"
        >
          {lang === 'ES' ? 'Líderes en Distribución Médica' : 'Leaders in Medical Distribution'}
        </motion.div>

        {/* Logo image — framer-motion entrance kept as-is */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center w-full -my-2"
        >
          <Image
            src="/assets/logo.png"
            alt="Maines SRL"
            width={340}
            height={130}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* ── Title: word-split, animated by GSAP timeline ────────────────── */}
        {/*
          Each word is an inline-block span with class "hero-word".
          GSAP's useGSAP (scoped to containerRef) targets these spans.
          No framer-motion on these elements — GSAP has full ownership.
        */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 font-light leading-relaxed">
          {words.map((word, i) => (
            <span
              key={i}
              // Trailing space via margin; last word has none
              className="hero-word inline-block mr-[0.28em] last:mr-0"
            >
              {word}
            </span>
          ))}
        </p>

        {/* Description — framer-motion entrance kept as-is */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto text-base text-slate-400 font-light"
        >
          {headline}
        </motion.p>

        {/* CTAs — framer-motion entrance kept as-is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#marcas"
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-xl shadow-primary/25 hover:scale-105 transition-transform text-center"
          >
            {cta}
          </a>
          <a
            href="#contacto"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all text-center"
          >
            {lang === 'ES' ? 'Contacto' : 'Contact'}
          </a>
        </motion.div>
      </div>

      {/* ── Floating stats — desktop only ────────────────────────────────── */}
      {/*
        Architecture: TWO layers per card.
          • Outer <div className="hero-stat"> — targeted by GSAP autoAlpha entrance.
            No framer-motion here, so there is ZERO opacity/transform conflict.
          • Inner <motion.div> — only handles the continuous y-float loop.
            GSAP never touches this element.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={cn(
              'hero-stat absolute',
              idx === 0 && 'top-[25%] left-[5%]',
              idx === 1 && 'top-[40%] right-[8%]',
              idx === 2 && 'bottom-[20%] left-[12%]',
            )}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.5,
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-headline text-white">{stat.value}</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.text}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
