
"use client";

import { motion } from 'framer-motion';
import { Calendar, Layers, MapPin } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';

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
  const { lang } = useBrandStore();
  const l = lang === 'ES' ? 'es' : 'en';

  const headline = siteConfig['hero_headline']?.[l] ?? fallback.headline[l];
  const subheadline = siteConfig['hero_subheadline']?.[l] ?? fallback.subheadline[l];
  const cta = siteConfig['hero_cta']?.[l] ?? fallback.cta[l];

  const stats = [
    {
      icon: Calendar,
      value: '+10',
      text: lang === 'ES' ? 'Años de experiencia' : 'Years of experience',
    },
    {
      icon: Layers,
      value: '3',
      text: lang === 'ES' ? 'Marcas Premium' : 'Premium Brands',
    },
    {
      icon: MapPin,
      value: 'SCZ',
      text: 'Bolivia',
    },
  ];

  return (
    <section id="inicio" className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full text-center space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase"
        >
          {lang === 'ES' ? 'Líderes en Distribución Médica' : 'Leaders in Medical Distribution'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-headline text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Maines SRL.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-light"
        >
          {subheadline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto text-base text-slate-500 font-light"
        >
          {headline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#marcas" className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-xl shadow-primary/25 hover:scale-105 transition-transform text-center">
            {cta}
          </a>
          <a href="#contacto" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/60 text-slate-900 rounded-full font-semibold hover:bg-white/60 transition-all text-center">
            {lang === 'ES' ? 'Contacto' : 'Contact'}
          </a>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 1, delay: 0.8 },
              x: { duration: 1, delay: 0.8 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }
            }}
            className={cn(
              "absolute bg-white/30 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-2",
              idx === 0 && "top-[25%] left-[5%]",
              idx === 1 && "top-[40%] right-[8%]",
              idx === 2 && "bottom-[20%] left-[12%]"
            )}
          >
            <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center text-primary shadow-inner">
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-headline text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.text}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
