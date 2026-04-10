
"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Star, Zap, Gem, Target, Eye, LucideIcon } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { PillarRow } from '@/lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'star': Star,
  'zap': Zap,
  'gem': Gem,
  'target': Target,
  'eye': Eye,
};

const bentoConfig = [
  { size: "col-span-1 md:col-span-2 row-span-1", color: "bg-[#1B3A6B]/10" },
  { size: "col-span-1 row-span-1", color: "bg-emerald-500/10" },
  { size: "col-span-1 row-span-1", color: "bg-purple-500/10" },
  { size: "col-span-1 md:col-span-2 row-span-1", color: "bg-amber-500/10" },
  { size: "col-span-1 row-span-1", color: "bg-fuchsia-500/10" },
  { size: "col-span-1 row-span-1", color: "bg-cyan-500/10" },
];

interface CorporateGridProps {
  pillars: PillarRow[];
  siteConfig: Record<string, { es: string; en: string }>;
}

export function CorporateGrid({ pillars, siteConfig }: CorporateGridProps) {
  const { lang } = useBrandStore();
  const l = lang === 'ES' ? 'es' : 'en';

  const sectionTitle = siteConfig['pillars_title']?.[l] ?? (lang === 'ES' ? 'Por qué elegirnos' : 'Why choose us');

  const items = [
    ...pillars.slice(0, 4).map((p) => ({
      iconName: p.icon_name,
      title: l === 'es' ? p.title_es : p.title_en,
      desc: l === 'es' ? p.description_es : p.description_en,
    })),
    {
      iconName: 'target',
      title: lang === 'ES' ? 'Misión' : 'Mission',
      desc: siteConfig['mission']?.[l] ?? '',
    },
    {
      iconName: 'eye',
      title: lang === 'ES' ? 'Visión' : 'Vision',
      desc: siteConfig['vision']?.[l] ?? '',
    },
  ];

  return (
    <section id="nosotros" className="min-h-screen py-16 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      <div className="text-center space-y-4 mb-10 md:mb-16 flex flex-col items-center justify-center">
        <h2 className="font-headline text-5xl md:text-6xl font-bold text-white tracking-tight">{sectionTitle}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const IconComponent = iconMap[item.iconName] ?? ShieldCheck;
          const config = bentoConfig[idx];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                "group relative overflow-hidden p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-xl hover:bg-white/10 transition-all",
                config.size
              )}
            >
              <div className={cn("absolute -right-4 -top-4 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity", config.color)} />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
