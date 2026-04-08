"use client";

import { useState } from 'react';
import { Shield, Flame, Brain, Bone, ChevronRight } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow, BrandProductRow } from '@/lib/supabase';

const CATALOG_URL =
  'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/catalogo-maines.pdf';

const systemIcons = [Shield, Flame, Brain, Bone];
const systemColors = [
  'bg-emerald-500/10 text-emerald-600 border-emerald-200/60',
  'bg-lime-500/10 text-lime-600 border-lime-200/60',
  'bg-teal-500/10 text-teal-600 border-teal-200/60',
  'bg-green-500/10 text-green-600 border-green-200/60',
];

interface XtralifeCatalogProps {
  brand: BrandRow | null;
  products: BrandProductRow[];
}

export function XtralifeCatalog({ brand, products }: XtralifeCatalogProps) {
  const { lang } = useBrandStore();
  const t = translations[lang].xtralife.catalog;
  const l = lang === 'ES' ? 'es' : 'en';

  const [activeTab, setActiveTab] = useState(products[0]?.name ?? null);

  const activeProduct = products.find((p) => p.name === activeTab) ?? products[0] ?? null;
  const benefits: string[] = activeProduct
    ? ((l === 'es' ? activeProduct.benefits_es : activeProduct.benefits_en) as string[]) ?? []
    : [];

  return (
    <section
      id="catalogo"
      className="relative min-h-screen py-32 px-6 flex flex-col justify-center scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-headline text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Body systems grid — static cards from translations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {t.systems.map((system, idx) => {
            const Icon = systemIcons[idx] ?? Shield;
            const colorClass = systemColors[idx] ?? systemColors[0];

            return (
              <div
                key={idx}
                className={`group relative bg-white/40 backdrop-blur-xl border border-white/60 hover:border-emerald-300 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:bg-white/55 transition-all overflow-hidden`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white/60 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-headline font-bold text-slate-900">{system.name}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-light">{system.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Products from Supabase (if available) */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: tabs + product info */}
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                {products.map((product) => (
                  <button
                    key={product.name}
                    onClick={() => setActiveTab(product.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === product.name
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                        : 'bg-white/30 text-slate-700 hover:bg-white/50 border border-white/60'
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>

              {activeProduct && (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 space-y-4 shadow-xl">
                  <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
                    {l === 'es' ? activeProduct.subtitle_es : activeProduct.subtitle_en}
                  </p>
                  <p className="text-slate-700 text-base font-light leading-relaxed">
                    {l === 'es' ? activeProduct.description_es : activeProduct.description_en}
                  </p>
                  {benefits.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {t.benefits}
                      </p>
                      <ul className="space-y-1.5">
                        {benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <a
                  href={CATALOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform"
                >
                  {t.fullCatalog}
                </a>
                <a
                  href="#contacto"
                  className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/60 text-slate-900 rounded-full font-semibold hover:bg-white/60 transition-all flex items-center gap-2"
                >
                  {t.talkAdvisor} <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: product image */}
            <div className="relative aspect-square bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent pointer-events-none z-10" />
              {activeProduct?.image_url ? (
                <img
                  key={activeProduct.image_url}
                  src={activeProduct.image_url}
                  alt={activeProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/20">
                  {brand?.logo_url && (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-32 w-auto object-contain opacity-80"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
