'use client';

import { useRef } from 'react';
import { ShieldCheck, Microscope, Layers, Target } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap-setup';

// Importing ScrollTrigger ensures the scrollTrigger TweenVars type is available.
void ScrollTrigger;

const pillarIcons = [ShieldCheck, Microscope, Layers, Target];

const pillarColors = [
  'bg-white/60 text-purple-600',
  'bg-white/60 text-fuchsia-600',
  'bg-white/60 text-violet-600',
  'bg-white/60 text-indigo-600',
];

export function JetemaPhilosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const { lang } = useBrandStore();
  const t = translations[lang].jetema.philosophy;

  // ─── GSAP: PIN + sequential card reveal with scrub ──────────────────────
  //
  // Rule: ScrollTrigger goes on the TIMELINE, never on a child tween.
  // Rule: scrub and toggleActions must NOT be used together; scrub: 1 only.
  //
  // The section is pinned for an extra 400px of scroll. As the user scrolls
  // through that range, the 4 pillar cards reveal sequentially (scrub: 1).
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Cards start invisible; the timeline drives them in as user scrolls.
      // We set their initial state explicitly so there's no flash before pin.
      gsap.set('.gsap-pillar-card', { autoAlpha: 0, y: 50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400',
          pin: true,
          scrub: 1,
          // No toggleActions — scrub drives the playhead; both must not coexist.
        },
      });

      // Each card animates in sequentially as the user scrolls through the 400px pin.
      // stagger inside the fromTo distributes them evenly across the timeline.
      tl.fromTo(
        '.gsap-pillar-card',
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, stagger: 0.25, duration: 0.6, ease: 'power2.out' },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      id="filosofia"
      ref={containerRef}
      className="relative min-h-screen py-32 px-6 flex flex-col justify-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header — not part of the pin timeline, shows before scroll */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="font-headline text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* ── Pillar cards — targeted by GSAP as `.gsap-pillar-card` ───────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.pillars.map((pillar, idx) => {
            const Icon       = pillarIcons[idx] ?? ShieldCheck;
            const colorClass = pillarColors[idx] ?? pillarColors[0];

            return (
              <div
                key={idx}
                className={`gsap-pillar-card group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl hover:bg-white/55 transition-shadow overflow-hidden`}
              >
                {/* Glow accent — CSS only, no animation */}
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${colorClass}`}
                  >
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
