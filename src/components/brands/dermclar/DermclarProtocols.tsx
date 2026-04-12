"use client";

import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';

export function DermclarProtocols() {
  const { lang } = useBrandStore();
  const t = translations[lang].dermclar.protocols;

  return (
    <section
      id="protocolos"
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

        {/* Protocol steps — horizontal on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative bg-white/40 backdrop-blur-xl border border-white/60 hover:border-[#38BDF8]/40 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:bg-white/55 transition-all overflow-hidden flex flex-col gap-4"
            >
              {/* Glow */}
              <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#38BDF8]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Step number */}
                <span className="font-headline text-5xl font-bold text-[#38BDF8]/30 leading-none select-none">
                  {step.step}
                </span>

                {/* Content */}
                <div className="mt-2 space-y-2">
                  <h3 className="text-lg font-headline font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-light">{step.desc}</p>
                </div>

                {/* Connector line — hidden on last item and on mobile */}
                {idx < t.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-[#38BDF8]/40 -translate-y-1/2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
