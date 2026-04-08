import { Metadata } from 'next';
import { supabase, buildConfigMap, SiteConfigRow, BrandRow, BrandProductRow, SocialLinkRow } from '@/lib/supabase';
import { BrandSubLayout } from '@/components/brands/BrandSubLayout';
import { JetemaHero } from '@/components/brands/jetema/JetemaHero';
import { JetemaPhilosophy } from '@/components/brands/jetema/JetemaPhilosophy';
import { JetemaCatalog } from '@/components/brands/jetema/JetemaCatalog';
import { FooterCTA } from '@/components/FooterCTA';

export const metadata: Metadata = {
  title: 'Jetema | Revolución Biotecnológica — Maines S.R.L.',
  description: 'Precisión coreana en medicina regenerativa. Toxinas botulínicas de alta pureza y rellenos dérmicos de nueva generación.',
};

export default async function JetemaPage() {
  const [
    { data: siteConfigRows },
    { data: brandData },
    { data: socialLinksData },
  ] = await Promise.all([
    supabase.from('site_config').select('key, value_es, value_en, section'),
    supabase.from('brands').select('*').eq('slug', 'jetema').single(),
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
    { label: 'Filosofía', href: '#filosofia' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <BrandSubLayout
      brandSlug="jetema"
      brandName="Jetema"
      logoUrl={logoUrl}
      brandLogoUrl={brand?.logo_url || undefined}
      navLinks={navLinks}
    >
      {/* 1. Hero */}
      <section id="hero" data-snap="always">
        <JetemaHero brand={brand} />
      </section>

      {/* 2. Filosofía de Seguridad */}
      <section id="filosofia" data-snap>
        <JetemaPhilosophy />
      </section>

      {/* 3. Catálogo Tecnológico */}
      <section id="catalogo" data-snap>
        <JetemaCatalog brand={brand} products={products} />
      </section>

      {/* 4. Contacto / Footer */}
      <section id="contacto" data-snap="always">
        <div className="container mx-auto px-4 md:px-0">
          <FooterCTA
                siteConfig={siteConfig}
                socialLinks={socialLinks}
                logoUrl={logoUrl}
                instagramBadge={{
                  handle: '@jetemaboliviaoficial',
                  url: 'https://www.instagram.com/jetemaboliviaoficial/',
                  color: '#7C3AED',
                }}
              />
        </div>
      </section>
    </BrandSubLayout>
  );
}
