
"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useBrandStore, BrandType } from '@/store/useBrandStore';
import { ChevronRight, ArrowUpRight, Instagram } from 'lucide-react';
import { supabase, BrandRow, BrandProductRow, SocialLinkRow } from '@/lib/supabase';

// Inline TikTok SVG (not in Lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z" />
    </svg>
  );
}

const CATALOG_URL = 'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/catalogo-maines.pdf';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

interface BrandImageGalleryProps {
  images: string[];
  brandSlug: string;
  logoUrl: string;
}

function BrandImageGallery({ images, brandSlug, logoUrl }: BrandImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  // Reset on brand or image set change
  useEffect(() => {
    setCurrent(0);
  }, [brandSlug, images.join(',')]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    const bgClass =
      brandSlug === 'xtralife'
        ? 'bg-emerald-900/60'
        : brandSlug === 'dermclar'
        ? 'bg-blue-900/60'
        : 'bg-slate-900/40';
    return (
      <div className={`w-full h-full flex items-center justify-center ${bgClass}`}>
        <img src={logoUrl || undefined} alt={brandSlug} className="max-h-32 w-auto object-contain opacity-90" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`Producto ${current + 1}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BrandShowcaseProps {
  brands: BrandRow[];
  socialLinks: SocialLinkRow[];
}

export function BrandShowcase({ brands, socialLinks }: BrandShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeBrand, setActiveBrand, setIsBrandSectionInView, lang } = useBrandStore();
  const isInView = useInView(sectionRef, { amount: 0.3 });
  const [products, setProducts] = useState<BrandProductRow[]>([]);
  const [activeProductName, setActiveProductName] = useState<string | null>(null);
  const [catalogAvailable, setCatalogAvailable] = useState(false);
  const l = lang === 'ES' ? 'es' : 'en';

  useEffect(() => {
    setIsBrandSectionInView(isInView);
  }, [isInView, setIsBrandSectionInView]);

  // Check catalog PDF availability once
  useEffect(() => {
    fetch(CATALOG_URL, { method: 'HEAD' })
      .then((r) => setCatalogAvailable(r.ok))
      .catch(() => setCatalogAvailable(false));
  }, []);

  // Reset product when brand changes
  useEffect(() => {
    setActiveProductName(null);
  }, [activeBrand]);

  // Fetch products when brand changes
  useEffect(() => {
    if (activeBrand === 'maines') {
      setProducts([]);
      return;
    }
    const activeBrandData = brands.find((b) => b.slug === activeBrand);
    if (!activeBrandData) return;

    supabase
      .from('brand_products')
      .select('*')
      .eq('brand_id', activeBrandData.id)
      .order('sort_order')
      .then(({ data }) => {
        const rows = (data as BrandProductRow[]) ?? [];
        setProducts(rows);
        if (rows.length > 0) setActiveProductName(rows[0].name);
      });
  }, [activeBrand, brands]);

  const activeBrandData = brands.find((b) => b.slug === activeBrand);
  const currentProduct = products.find((p) => p.name === activeProductName) ?? products[0] ?? null;

  // Gallery images for the active product only
  const currentProductImages = (() => {
    if (!currentProduct) return [];
    const imgs: string[] = [];
    if (currentProduct.image_url) imgs.push(currentProduct.image_url);
    if (
      currentProduct.specs &&
      typeof currentProduct.specs === 'object' &&
      'vial2_image_url' in currentProduct.specs
    ) {
      imgs.push(currentProduct.specs['vial2_image_url'] as string);
    }
    return imgs.filter((url) => url.trim() !== '');
  })();

  const featureItems: string[] = currentProduct
    ? ((l === 'es' ? currentProduct.benefits_es : currentProduct.benefits_en) as string[]) ?? []
    : [];

  const brandColorClass = (slug: string) => {
    if (slug === 'dermclar') return 'text-blue-600';
    if (slug === 'xtralife') return 'text-emerald-600';
    return 'text-purple-600';
  };

  const brandBgClass = (slug: string) => {
    if (slug === 'dermclar') return 'bg-blue-600';
    if (slug === 'xtralife') return 'bg-emerald-600';
    return 'bg-purple-600';
  };

  const brandsTitle = l === 'es' ? 'Nuestras Marcas' : 'Our Brands';
  const brandsDesc =
    l === 'es'
      ? 'Representamos exclusivamente marcas líderes en salud y estética.'
      : 'We exclusively represent leading brands in health and aesthetics.';
  const exploreLabel = l === 'es' ? 'Explorar Portafolio' : 'Explore Portfolio';
  const catalogLabel = l === 'es' ? 'Catálogo Completo' : 'Full Catalog';
  const advisorLabel = l === 'es' ? 'Hablar con un asesor' : 'Talk to an Advisor';
  const soonLabel = l === 'es' ? 'Próximamente' : 'Coming soon';

  return (
    <section id="marcas" ref={sectionRef} className="relative min-h-screen py-32 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeBrand === 'maines' ? (
            /* ── OVERVIEW: 3 brand cards ── */
            <motion.div
              key="maines-grid"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center space-y-16"
            >
              <div className="space-y-4">
                <h2 className="font-headline text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">{brandsTitle}</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">{brandsDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                {brands.map((brand) => {
                  const brandInsta = socialLinks.find(
                    (s) => s.platform === 'instagram' && s.label.toLowerCase().includes(brand.slug)
                  );
                  const brandTiktok = socialLinks.find(
                    (s) => s.platform === 'tiktok' && s.label.toLowerCase().includes(brand.slug)
                  );

                  return (
                    <motion.div
                      key={brand.slug}
                      whileHover={{ scale: 1.02, y: -8, boxShadow: '0 32px 64px -12px rgba(0,0,0,0.15)' }}
                      onClick={() => setActiveBrand(brand.slug as BrandType)}
                      className="group relative bg-white/40 backdrop-blur-xl border border-white/50 p-10 rounded-[2.5rem] flex flex-col items-center text-center cursor-pointer hover:bg-white/60 transition-all shadow-xl overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-6 h-6 text-primary" />
                      </div>

                      <div className="bg-white/80 px-4 py-2 rounded-2xl shadow-sm mb-6 transition-transform group-hover:scale-110 flex items-center justify-center">
                        <img src={brand.logo_url || undefined} alt={brand.name} className="h-20 w-auto object-contain transform scale-110 origin-center" />
                      </div>

                      <h3 className="text-2xl font-headline font-bold text-slate-900 mb-1">{brand.name}</h3>
                      <p className="text-slate-500 text-xs font-medium mb-3 uppercase tracking-widest">
                        {l === 'es' ? brand.tagline_es : brand.tagline_en}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                        {l === 'es' ? brand.short_desc_es : brand.short_desc_en}
                      </p>

                      {/* Social links */}
                      {(brandInsta || brandTiktok) && (
                        <div className="flex gap-3 mb-6" onClick={(e) => e.stopPropagation()}>
                          {brandInsta && (
                            <a
                              href={brandInsta.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {brandTiktok && (
                            <a
                              href={brandTiktok.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                            >
                              <TikTokIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                        {exploreLabel} <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ── BRAND DETAIL ── */
            <motion.div
              key={activeBrand}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className={cn("text-sm font-bold uppercase tracking-widest", brandColorClass(activeBrand))}>
                    {activeBrandData ? (l === 'es' ? activeBrandData.tagline_es : activeBrandData.tagline_en) : ''}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="bg-white/80 px-4 py-2 rounded-2xl shadow-sm">
                      <img
                        src={activeBrandData?.logo_url || undefined}
                        alt={activeBrand}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <h2 className="font-headline text-5xl md:text-7xl font-bold text-slate-900">
                      {activeBrandData?.name ?? ''}
                    </h2>
                  </div>

                  <div className="bg-white/30 backdrop-blur-md border border-white/40 p-6 rounded-3xl">
                    <p className="text-lg md:text-xl text-slate-700 font-light leading-relaxed">
                      {activeBrandData
                        ? (l === 'es' ? activeBrandData.description_es : activeBrandData.description_en)
                        : ''}
                    </p>
                  </div>
                </motion.div>

                {/* Product tabs + info */}
                {products.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-4">
                    {/* Mini tabs */}
                    <div className="flex gap-2 flex-wrap">
                      {products.map((product) => (
                        <button
                          key={product.name}
                          onClick={() => setActiveProductName(product.name)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-all',
                            activeProductName === product.name
                              ? cn(brandBgClass(activeBrand), 'text-white shadow-md')
                              : 'bg-white/20 text-slate-700 hover:bg-white/30'
                          )}
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>

                    {/* Active product info */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProductName ?? 'none'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 p-4 rounded-2xl space-y-3"
                      >
                        {currentProduct && (
                          <>
                            <p className="text-sm text-slate-700 font-medium">
                              {l === 'es' ? currentProduct.subtitle_es : currentProduct.subtitle_en}
                            </p>
                            <ul className="space-y-1.5">
                              {featureItems.map((b, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                  <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', brandBgClass(activeBrand))} />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  {catalogAvailable ? (
                    <a
                      href={CATALOG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'px-10 py-5 rounded-full text-white font-bold shadow-lg transition-transform hover:scale-105',
                        brandBgClass(activeBrand)
                      )}
                    >
                      {catalogLabel}
                    </a>
                  ) : (
                    <div className="relative group/catalog">
                      <button
                        disabled
                        className={cn(
                          'px-10 py-5 rounded-full text-white font-bold shadow-lg opacity-60 cursor-not-allowed',
                          brandBgClass(activeBrand)
                        )}
                      >
                        {catalogLabel}
                      </button>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover/catalog:opacity-100 transition-opacity pointer-events-none">
                        {soonLabel}
                      </div>
                    </div>
                  )}
                  <a
                    href="#contacto"
                    className="px-10 py-5 bg-white/40 backdrop-blur-md border border-white/60 text-slate-900 rounded-full font-bold flex items-center gap-2 hover:bg-white/60 transition-all"
                  >
                    {advisorLabel} <ChevronRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>

              {/* Gallery — synced with active product */}
              <motion.div
                variants={itemVariants}
                className="relative aspect-video lg:aspect-square bg-white/20 backdrop-blur-2xl border border-white/40 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none z-10" />
                <BrandImageGallery
                  key={`${activeBrand}-${activeProductName ?? 'none'}`}
                  images={currentProductImages}
                  brandSlug={activeBrand}
                  logoUrl={activeBrandData?.logo_url ?? ''}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
