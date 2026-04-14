'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Layers, MapPin, ChevronDown } from 'lucide-react';
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

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function Hero({ siteConfig }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { lang } = useBrandStore();
  const l = lang === 'ES' ? 'es' : 'en';

  const headline    = siteConfig['hero_headline']?.[l]    ?? fallback.headline[l];
  const subheadline = siteConfig['hero_subheadline']?.[l] ?? fallback.subheadline[l];
  const cta         = siteConfig['hero_cta']?.[l]         ?? fallback.cta[l];

  const words = subheadline.split(' ');

  const stats = [
    { icon: Calendar, value: '+10', text: lang === 'ES' ? 'Años de experiencia' : 'Years of experience' },
    { icon: Layers,   value: '3',   text: lang === 'ES' ? 'Marcas Premium' : 'Premium Brands' },
    { icon: MapPin,   value: 'SCZ', text: 'Bolivia' },
  ];

  // ── GSAP: entrance animations + MASTER Scroll Pin (Single Stage) ──────────
  useGSAP(
    () => {
      // Entrance: word-split subheadline stagger
      gsap.timeline({ delay: 0.4 }).fromTo(
        '.hero-word',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out' },
      );

      // Entrance: stat cards
      gsap.fromTo(
        '.hero-stat',
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: 0.15, duration: 0.8, delay: 0.9, ease: 'power2.out' },
      );

      // ── MASTER TIMELINE: Single Stage scroll experience ──────────────────
      // The hero section pins in place. GSAP drives:
      //   Act 1 → fade hero-stage OUT (while background/particles remain)
      //   Act 2 → fade intro-text IN  (over the same living background)
      //   Act 3 → fade intro-text OUT (section unpins → brand cards revealed)
      // snap: true ensures the scroll "auto-completes" the journey —
      //   snapping to 0 (back to hero) or 1 (end → reveals brand cards).
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1400',
          pin: true,
          scrub: 1.2,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.5, max: 1.2 },
            ease: 'power2.inOut',
          },
        },
      });

      masterTl
        // Act 1: hero-stage fades up and out
        .to('.hero-stage', { autoAlpha: 0, y: -60, duration: 3, ease: 'power2.in' })
        // Act 2: intro-text fades in simultaneously from slightly below centre
        .fromTo(
          '.intro-text',
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 2.5, ease: 'power2.out' },
          '-=1.5', // overlap with Act 1 exit
        )
        // Act 3: intro-text fades out — scroll continues to brand cards
        .to('.intro-text', { autoAlpha: 0, scale: 1.08, duration: 2, ease: 'power2.in' }, '+=1');
    },
    { scope: containerRef },
  );

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden w-full"
    >

      {/*
        ── hero-stage ───────────────────────────────────────────────────────────
        All visible hero content lives here. GSAP's masterTl targets this single
        wrapper with autoAlpha + y, cleanly fading/moving everything at once.
      */}
      <div className="hero-stage absolute inset-0 flex flex-col items-center justify-center px-6 pt-24 pb-16 z-10">

        {/* Central text block */}
        <div className="w-full text-center space-y-5 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase"
          >
            {lang === 'ES' ? 'Líderes en Distribución Médica' : 'Leaders in Medical Distribution'}
          </motion.div>

          {/* Logo */}
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

          {/* Subheadline — word-split, GSAP owns autoAlpha/y */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
            {words.map((word, i) => (
              <span key={i} className="hero-word inline-block mr-[0.28em] last:mr-0">
                {word}
              </span>
            ))}
          </p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xl mx-auto text-base text-slate-500 dark:text-slate-400 font-light"
          >
            {headline}
          </motion.p>

          {/* CTAs */}
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
              className="px-8 py-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-full font-semibold hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all text-center"
            >
              {lang === 'ES' ? 'Contacto' : 'Contact'}
            </a>
          </motion.div>
        </div>

        {/* ── Floating stat cards — desktop only ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={cn(
                'hero-stat absolute',
                idx === 0 && 'top-[15%] left-[2%] xl:top-[20%] xl:left-[5%] 2xl:left-[8%]',
                idx === 1 && 'top-[35%] right-[2%] xl:top-[40%] xl:right-[6%] 2xl:right-[8%]',
                idx === 2 && 'bottom-[12%] left-[6%] xl:bottom-[20%] xl:left-[12%]',
              )}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
                className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-slate-800/60 p-4 xl:p-6 rounded-xl xl:rounded-2xl shadow-xl xl:shadow-2xl flex flex-col items-center gap-1 xl:gap-2 lg:scale-90 xl:scale-100"
              >
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white/50 dark:bg-slate-800/50 rounded-lg xl:rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <stat.icon className="w-5 h-5 xl:w-6 xl:h-6" />
                </div>
                <div className="text-center">
                  <div className="text-xl xl:text-2xl font-bold font-headline text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] xl:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.text}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* ── Scroll Down indicator ── */}
        <motion.button
          onClick={() => document.getElementById('marcas')?.scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center gap-2 cursor-pointer text-slate-400 hover:text-primary transition-colors focus:outline-none pointer-events-auto"
          aria-label="Ir a Marcas"
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold opacity-80">
            {lang === 'ES' ? 'Deslizar hacia abajo' : 'Scroll Down'}
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>

      </div>{/* end hero-stage */}

      {/*
        ── intro-text (Act 2) ──────────────────────────────────────────────────
        Absolute sibling of hero-stage — shares the same pinned section and
        thus the same living background (particles). Starts fully invisible;
        GSAP masterTl drives its entrance and exit.
      */}
      <div
        className="intro-text absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden', transform: 'scale(0.92)' }}
      >
        {/* Subtle scrim so text pops over the particle background */}
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />
        <h2 className="relative z-10 text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight text-center px-6 leading-tight max-w-4xl font-headline drop-shadow-2xl">
          {lang === 'ES' ? 'Te presentamos nuestras\nmarcas exclusivas' : 'Introducing our\nexclusive brands'}
        </h2>
      </div>

    </section>
  );
}
