"use client";

import { Sparkles, Zap, Droplets, FlaskConical } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';

const solutionIcons = [Sparkles, Zap, Droplets, FlaskConical];

const solutionColors = [
  { card: 'hover:border-blue-300', icon: 'bg-blue-500/10 text-blue-600', glow: 'bg-blue-400/10' },
  { card: 'hover:border-cyan-300', icon: 'bg-cyan-500/10 text-cyan-600', glow: 'bg-cyan-400/10' },
  { card: 'hover:border-sky-300', icon: 'bg-sky-500/10 text-sky-600', glow: 'bg-sky-400/10' },
  { card: 'hover:border-indigo-300', icon: 'bg-indigo-500/10 text-indigo-600', glow: 'bg-indigo-400/10' },
];

export function DermclarSolutions() {
  const { lang } = useBrandStore();
  const t = translations[lang].dermclar.solutions;

  return (
    <section
      id="soluciones"
      className="relative min-h-screen py-32 px-6 flex flex-col justify-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="font-headline text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((item, idx) => {
            const Icon = solutionIcons[idx] ?? Sparkles;
            const colors = solutionColors[idx] ?? solutionColors[0];

            return (
              <div
                key={idx}
                className={`group relative bg-white/40 backdrop-blur-xl border border-white/60 ${colors.card} rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl hover:bg-white/55 transition-all overflow-hidden`}
              >
                {/* Glow accent */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 ${colors.glow} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-white/60 ${colors.icon}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
