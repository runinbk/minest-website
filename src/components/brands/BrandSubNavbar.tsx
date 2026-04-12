"use client";

import Link from 'next/link';
import { ArrowLeft, Menu, ChevronDown } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

interface BrandSubNavbarProps {
  logoUrl?: string;
  brandLogoUrl?: string;
  brandName: string;
  navLinks: { label: string; href: string }[];
}

export function BrandSubNavbar({ logoUrl, brandLogoUrl, brandName, navLinks }: BrandSubNavbarProps) {
  const { lang, setLang } = useBrandStore();
  const t = translations[lang].subBrands;

  const mainesLogoSrc =
    logoUrl ||
    'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/logomainesENV06.png';

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl rounded-full flex items-center justify-between">
      {/* Left: Back to Maines */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <img src={mainesLogoSrc} className="h-6 w-auto hidden sm:block" alt="Maines" />
        <span className="hidden md:inline">{t.backToHub}</span>
      </Link>

      {/* Center: Brand Switcher Dropdown */}
      <div className="relative group flex items-center justify-center">
        {brandLogoUrl && (
          <div className="flex items-center gap-1.5 cursor-pointer bg-white/60 hover:bg-white/90 px-4 py-1.5 rounded-full shadow-sm transition-all border border-black/5">
            <img src={brandLogoUrl} alt={brandName} className="h-6 w-auto object-contain" />
            <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-hover:rotate-180" />
          </div>
        )}

        {/* Dropdown Menu */}
        <div className="absolute top-full mt-2 w-48 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <Link
            href="/jetema"
            className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              brandName.toLowerCase() === 'jetema' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Jetema
          </Link>
          <Link
            href="/dermclar"
            className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              brandName.toLowerCase() === 'dermclar' ? 'bg-[#38BDF8]/10 text-[#38BDF8]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dermclar
          </Link>
          <Link
            href="/xtralife"
            className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              brandName.toLowerCase() === 'xtralife' ? 'bg-[#06752E]/10 text-[#06752E]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Xtralife
          </Link>
        </div>
      </div>

      {/* Right: Nav links + lang toggle */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
          className="hidden sm:block px-5 py-1.5 bg-white/50 rounded-full text-sm font-bold text-slate-700 hover:bg-white/80 hover:text-primary transition-colors border border-slate-200"
        >
          {lang} | {lang === 'ES' ? 'EN' : 'ES'}
        </button>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Navigate {brandName} sections</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-12">
                <Link href="/" className="flex items-center gap-2 text-slate-600 font-medium mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToHub}
                </Link>
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-2xl font-headline font-bold text-slate-800"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
                  className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-4 rounded-2xl font-bold mt-4 transition-colors"
                >
                  {lang} | {lang === 'ES' ? 'EN' : 'ES'}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
