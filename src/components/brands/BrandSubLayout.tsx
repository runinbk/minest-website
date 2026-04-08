import { AuroraBackground } from '@/components/AuroraBackground';
import { BrandSubNavbar } from '@/components/brands/BrandSubNavbar';
import { BrandInitializer } from '@/components/brands/BrandInitializer';
import type { BrandType } from '@/store/useBrandStore';

interface BrandSubLayoutProps {
  children: React.ReactNode;
  brandSlug: BrandType;
  brandName: string;
  logoUrl?: string;
  brandLogoUrl?: string;
  navLinks: { label: string; href: string }[];
}

export function BrandSubLayout({
  children,
  brandSlug,
  brandName,
  logoUrl,
  brandLogoUrl,
  navLinks,
}: BrandSubLayoutProps) {
  return (
    <main className="relative w-full">
      {/* Shared aurora background — color driven by activeBrand in store */}
      <AuroraBackground />

      {/* Syncs Zustand store with the current brand page */}
      <BrandInitializer brand={brandSlug} />

      {/* Sub-brand navbar */}
      <BrandSubNavbar
        logoUrl={logoUrl}
        brandLogoUrl={brandLogoUrl}
        brandName={brandName}
        navLinks={navLinks}
      />

      {/* Page sections */}
      <div className="relative z-10">{children}</div>
    </main>
  );
}
