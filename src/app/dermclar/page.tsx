import { Metadata } from 'next';
import { supabase, buildConfigMap, SiteConfigRow, BrandRow, BrandProductRow, SocialLinkRow } from '@/lib/supabase';
import { BrandSubLayout } from '@/components/brands/BrandSubLayout';
import { DermclarHero } from '@/components/brands/dermclar/DermclarHero';
import { DermclarSolutions } from '@/components/brands/dermclar/DermclarSolutions';
import { DermclarProtocols } from '@/components/brands/dermclar/DermclarProtocols';
import { FooterCTA } from '@/components/FooterCTA';

export const metadata: Metadata = {
  title: 'Dermclar | Scientific Skincare — Maines S.R.L.',
  description: 'Líder mundial en biotecnología aplicada a la estética médica. Mesoterapia y cuidado profesional de la piel con estándares europeos.',
};

export default async function DermclarPage() {
  const [
    { data: siteConfigRows },
    { data: brandData },
    { data: socialLinksData },
  ] = await Promise.all([
    supabase.from('site_config').select('key, value_es, value_en, section'),
    supabase.from('brands').select('*').eq('slug', 'dermclar').single(),
    supabase.from('social_links').select('*').eq('is_active', true),
  ]);

  const siteConfig = buildConfigMap((siteConfigRows as SiteConfigRow[]) ?? []);
  const brand = brandData as BrandRow | null;
  const socialLinks = (socialLinksData as SocialLinkRow[]) ?? [];
  const logoUrl = siteConfig['company_logo_url']?.es || undefined;

  // Fetch products for this brand (available for future use in this page)
  const { data: productsData } = brand
    ? await supabase.from('brand_products').select('*').eq('brand_id', brand.id).order('sort_order')
    : { data: [] };
  const _products = (productsData as BrandProductRow[]) ?? [];

  const navLinks = [
    { label: 'Hero', href: '#hero' },
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Protocolos', href: '#protocolos' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <BrandSubLayout
      brandSlug="dermclar"
      brandName="Dermclar"
      logoUrl={logoUrl}
      brandLogoUrl={brand?.logo_url || undefined}
      navLinks={navLinks}
    >
      {/* 1. Hero */}
      <section id="hero" data-snap="always">
        <DermclarHero brand={brand} />
      </section>

      {/* 2. Soluciones Especializadas */}
      <section id="soluciones" data-snap>
        <DermclarSolutions />
      </section>

      {/* 3. Protocolos Clínicos */}
      <section id="protocolos" data-snap>
        <DermclarProtocols />
      </section>

      {/* 4. Contacto / Footer */}
      <section id="contacto" data-snap="always">
        <div className="container mx-auto px-4 md:px-0">
          <FooterCTA siteConfig={siteConfig} socialLinks={socialLinks} logoUrl={logoUrl} />
        </div>
      </section>
    </BrandSubLayout>
  );
}
