"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { BrandRow, BrandProductRow } from '@/lib/supabase';

const CATALOG_URL =
  'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/catalogo-maines.pdf';

interface JetemaCatalogProps {
  brand: BrandRow | null;
  products: BrandProductRow[];
}

export function JetemaCatalog({ brand: _brand, products }: JetemaCatalogProps) {
  const { lang } = useBrandStore();
  const t = translations[lang].jetema.catalog;
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

        {products.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white/30 backdrop-blur-xl border border-white/50 rounded-[2.5rem]">
            <p className="text-slate-500 text-lg font-light">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: tabs + product info */}
            <div className="space-y-6">
              {/* Product tabs */}
              <div className="flex gap-2 flex-wrap">
                {products.map((product) => (
                  <button
                    key={product.name}
                    onClick={() => setActiveTab(product.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === product.name
                        ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25'
                        : 'bg-white/30 text-slate-700 hover:bg-white/50 border border-white/60'
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>

              {/* Active product detail */}
              {activeProduct && (
                <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 space-y-4 shadow-xl">
                  <p className="text-sm font-semibold text-[#7C3AED] uppercase tracking-widest">
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
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={CATALOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#7C3AED] text-white rounded-full font-semibold shadow-xl shadow-[#7C3AED]/25 hover:scale-105 transition-transform"
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
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 to-transparent pointer-events-none z-10" />
              {activeProduct?.image_url ? (
                <img
                  key={activeProduct.image_url}
                  src={activeProduct.image_url}
                  alt={activeProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#7C3AED]/20">
                  {_brand?.logo_url && (
                    <img
                      src={_brand.logo_url}
                      alt={_brand.name}
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
