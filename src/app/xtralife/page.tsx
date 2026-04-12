import { Metadata } from 'next';
import { supabase, buildConfigMap, SiteConfigRow, BrandRow, BrandProductRow, SocialLinkRow } from '@/lib/supabase';
import { BrandSubLayout } from '@/components/brands/BrandSubLayout';
import { XtralifeHero } from '@/components/brands/xtralife/XtralifeHero';
import { XtralifeCatalog } from '@/components/brands/xtralife/XtralifeCatalog';
import { FooterCTA } from '@/components/FooterCTA';

export const metadata: Metadata = {
  title: 'Xtralife | Nutrición Celular & Bienestar — Maines S.R.L.',
  description: 'Suplementación de grado farmacéutico para optimizar el rendimiento humano y la longevidad celular.',
};

export default async function XtralifePage() {
  const [
    { data: siteConfigRows },
    { data: brandData },
    { data: socialLinksData },
  ] = await Promise.all([
    supabase.from('site_config').select('key, value_es, value_en, section'),
    supabase.from('brands').select('*').eq('slug', 'xtralife').single(),
    supabase.from('social_links').select('*').eq('is_active', true),
  ]);

  const siteConfig = buildConfigMap((siteConfigRows as SiteConfigRow[]) ?? []);
  const brand = brandData as BrandRow | null;
  const socialLinks = (socialLinksData as SocialLinkRow[]) ?? [];
  const logoUrl = siteConfig['company_logo_url']?.es || undefined;

  // Fetch products for this brand
  const { data: productsData } = brand
    ? await supabase.from('brand_products').select('*').eq('brand_id', brand.id).order('sort_order')
    : { data: [] };
  const products = (productsData as BrandProductRow[]) ?? [];

  const navLinks = [
    { label: 'Hero', href: '#hero' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <BrandSubLayout
      brandSlug="xtralife"
      brandName="Xtralife"
      logoUrl={logoUrl}
      brandLogoUrl={brand?.logo_url || undefined}
      navLinks={navLinks}
    >
      {/* 1. Hero */}
      <section id="hero" data-snap="always">
        <XtralifeHero brand={brand} />
      </section>

      {/* 2. Catálogo por Sistemas */}
      <section id="catalogo" data-snap>
        <XtralifeCatalog brand={brand} products={products} />
      </section>

      {/* 3. Contacto / Footer */}
      <section id="contacto" data-snap="always">
        <div className="container mx-auto px-4 md:px-0">
          <FooterCTA
                siteConfig={siteConfig}
                socialLinks={socialLinks}
                logoUrl={logoUrl}
                instagramBadge={{
                  handle: '@xtralifeboliviaoficial',
                  url: 'https://www.instagram.com/xtralifeboliviaoficial',
                  color: '#06752E',
                }}
              />
        </div>
      </section>
    </BrandSubLayout>
  );
}
