"use client";

import { ShieldCheck, Microscope, Layers, Target } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';

const pillarIcons = [ShieldCheck, Microscope, Layers, Target];

const pillarColors = [
  'bg-purple-500/10 text-purple-600',
  'bg-fuchsia-500/10 text-fuchsia-600',
  'bg-violet-500/10 text-violet-600',
  'bg-indigo-500/10 text-indigo-600',
];

export function JetemaPhilosophy() {
  const { lang } = useBrandStore();
  const t = translations[lang].jetema.philosophy;

  return (
    <section
      id="filosofia"
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

        {/* Pillars — bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx] ?? ShieldCheck;
            const colorClass = pillarColors[idx] ?? pillarColors[0];

            return (
              <div
                key={idx}
                className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl hover:bg-white/55 transition-all overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${colorClass} bg-white/60`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-slate-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {pillar.desc}
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
