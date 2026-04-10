"use client";

import Link from 'next/link';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow, SocialLinkRow } from '@/lib/supabase';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z" />
    </svg>
  );
}

const brandAccent: Record<string, string> = {
  dermclar: 'text-[#38BDF8]',
  xtralife: 'text-[#06752E]',
  jetema:   'text-[#7C3AED]',
};

const brandBorder: Record<string, string> = {
  dermclar: 'hover:border-[#38BDF8]/40',
  xtralife: 'hover:border-[#5DF878]/50',
  jetema:   'hover:border-[#7C3AED]/40',
};

interface BrandPortalProps {
  brands: BrandRow[];
  socialLinks: SocialLinkRow[];
}

export function BrandPortal({ brands, socialLinks }: BrandPortalProps) {
  const { lang } = useBrandStore();
  const t = translations[lang].subBrands;
  const l = lang === 'ES' ? 'es' : 'en';

  return (
    <section id="marcas" className="relative min-h-[90vh] py-16 px-6 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full mt-10 md:mt-0">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-5xl md:text-6xl font-bold text-white tracking-tight">
            {t.portalTitle}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t.portalSubtitle}
          </p>
        </div>

        {/* Brand cards — link to sub-pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {brands.map((brand) => {
            const brandInsta = socialLinks.find(
              (s) => s.platform === 'instagram' && s.label.toLowerCase().includes(brand.slug)
            );
            const brandTiktok = socialLinks.find(
              (s) => s.platform === 'tiktok' && s.label.toLowerCase().includes(brand.slug)
            );
            const accentClass = brandAccent[brand.slug] ?? 'text-primary';
            const borderClass = brandBorder[brand.slug] ?? 'hover:border-primary/30';

            return (
              <div
                key={brand.slug}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 ${borderClass} p-10 rounded-[2.5rem] flex flex-col items-center text-center hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 shadow-xl overflow-hidden`}
              >
                {/* Arrow icon — top right */}
                <Link
                  href={`/${brand.slug}`}
                  className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Ir a ${brand.name}`}
                >
                  <ArrowUpRight className={`w-6 h-6 ${accentClass}`} />
                </Link>

                {/* Brand logo */}
                <div className="bg-white/10 px-4 py-2 rounded-2xl shadow-sm mb-4 transition-transform group-hover:scale-110 flex items-center justify-center">
                  <img
                    src={brand.logo_url || undefined}
                    alt={brand.name}
                    className="h-16 w-auto object-contain"
                  />
                </div>

                {/* Brand info */}
                <h3 className="text-2xl font-headline font-bold text-white mb-1">{brand.name}</h3>
                <p className={`text-xs font-bold mb-3 uppercase tracking-widest ${accentClass}`}>
                  {l === 'es' ? brand.tagline_es : brand.tagline_en}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  {l === 'es' ? brand.short_desc_es : brand.short_desc_en}
                </p>

                {/* Social links */}
                {(brandInsta || brandTiktok) && (
                  <div className="flex gap-3 mb-6">
                    {brandInsta && (
                      <a
                        href={brandInsta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {brandTiktok && (
                      <a
                        href={brandTiktok.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                      >
                        <TikTokIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* CTA link to sub-page */}
                <Link
                  href={`/${brand.slug}`}
                  className={`mt-4 inline-flex items-center gap-2 font-bold text-sm ${accentClass} hover:gap-3 transition-all`}
                >
                  {t.visitBrand}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
