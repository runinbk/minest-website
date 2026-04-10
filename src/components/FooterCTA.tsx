
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Instagram, Facebook, ArrowRight, MessageCircle } from 'lucide-react';
import { useBrandStore } from '@/store/useBrandStore';
import { translations } from '@/lib/translations';
import { SocialLinkRow } from '@/lib/supabase';
import { InstagramBadge } from '@/components/shared/InstagramBadge';

interface FooterCTAProps {
  siteConfig: Record<string, { es: string; en: string }>;
  socialLinks: SocialLinkRow[];
  logoUrl?: string;
  instagramBadge?: { handle: string; url: string; color: string };
}

export function FooterCTA({ siteConfig, socialLinks, logoUrl, instagramBadge }: FooterCTAProps) {
  const { lang } = useBrandStore();
  const t = translations[lang].footer;
  const nav = translations[lang].nav;
  const l = lang === 'ES' ? 'es' : 'en';

  const ctaTitle = siteConfig['cta_title']?.[l] ?? t.ctaTitle1;
  const ctaSubtitle = siteConfig['cta_subtitle']?.[l] ?? t.ctaSubtitle;
  const ctaBtnWa = siteConfig['cta_button_wa']?.[l] ?? 'WhatsApp';
  const address = siteConfig['contact_address']?.[l] ?? t.address;
  const phone = siteConfig['contact_phone']?.[l] ?? '';
  const email = siteConfig['contact_email']?.[l] ?? '';
  const whatsappUrl = siteConfig['contact_whatsapp_url']?.[l] ?? 'https://wa.me/59177099888';
  const copyright = siteConfig['footer_copyright']?.[l] ?? t.rights;

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta de ${formData.name} — ${formData.institution}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\nInstitución: ${formData.institution}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const lat = siteConfig['contact_lat']?.[l] ?? '-17.7554465';
  const lng = siteConfig['contact_lng']?.[l] ?? '-63.1675686';
  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

  const instagramLinks = socialLinks.filter((s) => s.platform === 'instagram');
  const facebookLinks = socialLinks.filter((s) => s.platform === 'facebook');

  return (
    <footer id="contacto" className="relative pt-12 flex flex-col min-h-screen justify-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 mb-16 mt-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="font-headline text-5xl md:text-6xl font-bold text-white leading-tight">
              {ctaTitle}
            </h2>
            <p className="text-xl text-slate-300 font-light max-w-md">
              {ctaSubtitle}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#06752E] text-white rounded-full font-semibold shadow-lg hover:bg-[#06752E]/80 transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              {ctaBtnWa}
            </a>

            {/* Instagram badge — shown when a brand handle is provided */}
            {instagramBadge && (
              <InstagramBadge
                handle={instagramBadge.handle}
                url={instagramBadge.url}
                color={instagramBadge.color}
              />
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{t.form.name}</label>
                <input
                  type="text"
                  placeholder={t.form.placeholderName}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{t.form.institution}</label>
                <input
                  type="text"
                  placeholder={t.form.placeholderInst}
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{t.form.email}</label>
              <input
                type="email"
                placeholder={t.form.placeholderEmail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{t.form.message}</label>
              <textarea
                placeholder={t.form.placeholderMsg}
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder-slate-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
            >
              {t.form.send} <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {logoUrl && <img src={logoUrl} className="h-10 w-auto" alt="Maines" />}
              <span className="text-2xl font-bold text-yellow-600 tracking-tight">Maines S.R.L.</span>
            </div>
            <p className="text-slate-300 font-light leading-relaxed">{t.columns.brand}</p>
            <div className="flex gap-4">
              {instagramLinks.slice(0, 1).map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
              ))}
              {facebookLinks.slice(0, 1).map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
              ))}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#06752E] transition-all shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6 flex flex-col items-start md:items-center md:mx-auto">
            <h3 className="font-headline font-bold text-white text-lg uppercase tracking-widest text-left md:text-center">{t.columns.company}</h3>
            <ul className="space-y-4 flex flex-col items-start">
              {[nav.about, nav.brands, nav.contact].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>



          <div className="space-y-6">
            <h3 className="font-headline font-bold text-white text-lg uppercase tracking-widest">{t.columns.contact}</h3>
            <div className="space-y-4 text-slate-300 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 hover:underline hover:opacity-80 transition-all"
                >
                  {address}
                </a>
              </div>
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:opacity-80 transition-all"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:underline hover:opacity-80 transition-all"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-700/60 flex justify-center items-center text-slate-400 text-sm">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
