import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types for database tables
export interface SiteConfigRow {
  key: string
  value_es: string
  value_en: string
  section: string
}

export interface BrandRow {
  id: string
  slug: string
  name: string
  tagline_es: string
  tagline_en: string
  description_es: string
  description_en: string
  short_desc_es: string
  short_desc_en: string
  primary_color: string
  gradient_from: string
  gradient_to: string
  accent_color: string
  logo_url: string
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  whatsapp: string | null
  sort_order: number
}

export interface BrandProductRow {
  id: string
  brand_id: string
  name: string
  subtitle_es: string
  subtitle_en: string
  description_es: string
  description_en: string
  benefits_es: string[]
  benefits_en: string[]
  image_url: string | null
  logo_url: string | null
  accent_color: string | null
  specs: Record<string, string> | null
  sort_order: number
}

export interface PillarRow {
  icon_name: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  sort_order: number
}

export interface SocialLinkRow {
  platform: string
  label: string
  url: string
  handle: string
  is_active: boolean
}

// Helper: convert site_config rows to a key→{es,en} map
export function buildConfigMap(rows: SiteConfigRow[]): Record<string, { es: string; en: string }> {
  return Object.fromEntries(
    rows.map((row) => [row.key, { es: row.value_es, en: row.value_en }])
  )
}
