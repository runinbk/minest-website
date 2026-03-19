
import { AuroraBackground } from '@/components/AuroraBackground';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CorporateGrid } from '@/components/CorporateGrid';
import { BrandShowcase } from '@/components/BrandShowcase';
import { FooterCTA } from '@/components/FooterCTA';
import { supabase, buildConfigMap, SiteConfigRow, BrandRow, PillarRow, SocialLinkRow } from '@/lib/supabase';

export default async function Home() {
  const [
    { data: siteConfigRows },
    { data: brandsData },
    { data: pillarsData },
    { data: socialLinksData },
  ] = await Promise.all([
    supabase.from('site_config').select('key, value_es, value_en, section'),
    supabase.from('brands').select('*').order('sort_order'),
    supabase.from('pillars').select('*').order('sort_order'),
    supabase.from('social_links').select('*').eq('is_active', true),
  ]);

  const siteConfig = buildConfigMap((siteConfigRows as SiteConfigRow[]) ?? []);
  const brands = (brandsData as BrandRow[]) ?? [];
  const pillars = (pillarsData as PillarRow[]) ?? [];
  const socialLinks = (socialLinksData as SocialLinkRow[]) ?? [];

  const logoUrl = siteConfig['company_logo_url']?.es || undefined;

  return (
    <main className="relative w-full">
      {/* Fixed Aurora Background */}
      <AuroraBackground />

      {/* Navbars (Mutating) */}
      <Navbar logoUrl={logoUrl} />

      {/* Page Content */}
      <div className="relative z-10">
        {/* 1. Hero */}
        <section data-snap="always">
          <Hero siteConfig={siteConfig} />
        </section>

        {/* 2. BrandShowcase — primero las marcas */}
        <section data-snap>
          <BrandShowcase brands={brands} socialLinks={socialLinks} />
        </section>

        {/* 3. CorporateGrid — después el por qué elegirnos */}
        <section data-snap>
          <div className="container mx-auto px-4 md:px-0">
            <CorporateGrid pillars={pillars} siteConfig={siteConfig} />
          </div>
        </section>

        {/* 4. FooterCTA */}
        <section data-snap="always">
          <div className="container mx-auto px-4 md:px-0">
            <FooterCTA siteConfig={siteConfig} socialLinks={socialLinks} logoUrl={logoUrl} />
          </div>
        </section>
      </div>
    </main>
  );
}
