"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Instagram, ChevronRight } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow, SocialLinkRow } from '@/lib/supabase';

interface BrandPortalProps {
  brands: BrandRow[];
  socialLinks: SocialLinkRow[];
}

const brandAccent: Record<string, string> = {
  jetema:   '#7C3AED',
  dermclar: '#38BDF8',
  xtralife: '#06752E',
};

// Temp placeholder images
const tempImages: Record<string, string> = {
  jetema:   'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop',
  dermclar: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop',
  xtralife: 'https://images.unsplash.com/photo-1542382156909-9ae37b3f56eb?q=80&w=1980&auto=format&fit=crop',
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z" />
    </svg>
  );
}

export function BrandPortal({ brands, socialLinks }: BrandPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const router = useRouter();
  
  const { lang } = useBrandStore();
  const t = translations[lang].subBrands;
  const l = lang === 'ES' ? 'es' : 'en';
  return (
    <div
      id="marcas"
      ref={containerRef}
      className="w-full h-screen relative bg-transparent overflow-hidden flex flex-col md:flex-row"
    >
      {brands.map((brand) => {
        const isHovered = hoveredBrand === brand.slug;
        const brandInsta = socialLinks.find(s => s.platform === 'instagram' && s.label.toLowerCase().includes(brand.slug));
        const brandTiktok = socialLinks.find(s => s.platform === 'tiktok' && s.label.toLowerCase().includes(brand.slug));
        
        const accentColor = brandAccent[brand.slug] ?? '#00e5ff';
        const bgImage = tempImages[brand.slug] ?? tempImages.jetema;

        return (
          <div
            key={brand.slug}
            onClick={() => router.push(`/${brand.slug}`)}
            onMouseEnter={() => setHoveredBrand(brand.slug)}
            onMouseLeave={() => setHoveredBrand(null)}
            className="group relative flex-1 min-h-[33vh] md:min-h-full border-b md:border-b-0 md:border-r border-white/10 last:border-0 overflow-hidden cursor-pointer"
            style={{
              transition: 'flex 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              flex: hoveredBrand ? (isHovered ? 1.6 : 0.7) : 1
            }}
          >
            {/* Background Image Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out z-0"
              style={{ backgroundImage: `url(${bgImage})`, transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
            
            {/* Gradient Overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10 transition-opacity duration-500" style={{ opacity: isHovered ? 0.7 : 0.9 }} />

            {/* Content Container */}
            <div className="brand-panel-content relative z-20 w-full h-full p-8 md:p-12 flex flex-col items-center md:items-start justify-end md:justify-center">
              
              {/* Logo / Title Block */}
              <div className="flex flex-col items-center md:items-start w-full transform transition-transform duration-500" style={{ y: isHovered ? -10 : 0 }}>
                <div className="h-14 md:h-20 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 mb-6 flex items-center justify-center">
                   {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="h-full w-auto object-contain" />
                  ) : (
                    <span className="text-white font-bold text-2xl tracking-widest uppercase">{brand.name}</span>
                  )}
                </div>
                
                <h3 className="text-3xl md:text-5xl font-headline font-bold text-white mb-2 text-center md:text-left drop-shadow-lg">
                  {brand.name}
                </h3>
                
                <p 
                  className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4 transition-colors duration-300"
                  style={{ color: accentColor }}
                >
                  {l === 'es' ? brand.tagline_es : brand.tagline_en}
                </p>

                <p className="text-white/70 text-sm md:text-base leading-relaxed md:max-w-sm text-center md:text-left opacity-0 md:opacity-100 hidden md:block" style={{
                  transition: 'all 0.4s ease',
                  opacity: isHovered ? 1 : 0.5,
                  transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
                }}>
                  {l === 'es' ? brand.short_desc_es : brand.short_desc_en}
                </p>
              </div>

              {/* Action Button & Socials - Revelead strictly on hover on Desktop */}
              <div 
                className="w-full mt-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500"
                style={{ 
                  opacity: isHovered ? 1 : 0, 
                  transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                  pointerEvents: isHovered ? 'auto' : 'none' 
                }}
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform">
                  {t.visitBrand} <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Social links */}
                {(brandInsta || brandTiktok) && (
                  <div className="flex gap-2">
                    {brandInsta && (
                      <a
                        href={brandInsta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
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
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                      >
                        <TikTokIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
            </div>
            
            {/* Visual Indicator arrow on the right side for desktop */}
            <div 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hidden md:flex opacity-0 transition-opacity duration-300"
              style={{ opacity: isHovered ? 0 : 1 }}
            >
              <ChevronRight className="w-8 h-8 opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
