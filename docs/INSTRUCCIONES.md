# INSTRUCCIONES PARA CLAUDE CODE — maines-demo-2
> Leer este archivo COMPLETO antes de tocar cualquier línea de código.
> Ubicación: `/docs/INSTRUCCIONES.md`

---

## CONTEXTO Y FILOSOFÍA

Estás trabajando sobre el proyecto **maines-demo-2** que ya tiene un diseño
funcional y estéticamente correcto (glassmorphism, aurora background, Framer
Motion, Zustand, Next.js 15, TypeScript).

### LA REGLA MÁS IMPORTANTE:
**NO cambies el diseño. NO cambies los colores. NO cambies la estructura de
componentes. NO cambies Tailwind config. NO cambies globals.css.**

Tu trabajo es exclusivamente:
1. Conectar Supabase para traer contenido real
2. Reemplazar textos hardcodeados por datos reales
3. Ajustar 3 componentes puntuales (descritos abajo)
4. Agregar switch ES/EN funcional

Si en algún momento dudás si algo es "cambio de diseño" — NO lo hagas.

---

## CREDENCIALES SUPABASE

Ya están en el `.env` del proyecto:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

El MCP de Supabase ya está conectado en Claude Code.

---

## BASE DE DATOS DISPONIBLE

Tablas en Supabase (ya con datos seed):

### `site_config` — textos generales
Columnas: `key`, `value_es`, `value_en`, `section`
Keys más importantes:
- `hero_headline`, `hero_subheadline`, `hero_cta`
- `mission`, `vision`, `about_p1`, `about_p2`
- `brands_section_title`, `brands_section_subtitle`
- `cta_title`, `cta_subtitle`, `cta_button_wa`, `cta_button_mail`
- `contact_email`, `contact_phone`, `contact_whatsapp_url`, `contact_address`
- `company_logo_url` (URL de logo Maines en Supabase Storage)
- `footer_copyright`

### `brands` — las 3 marcas
Columnas: `slug`, `name`, `tagline_es`, `tagline_en`, `description_es`,
`description_en`, `short_desc_es`, `short_desc_en`, `primary_color`,
`gradient_from`, `gradient_to`, `accent_color`, `logo_url`, `instagram`,
`facebook`, `tiktok`, `whatsapp`, `sort_order`

Slugs: `jetema`, `xtralife`, `dermclar`

### `brand_products` — productos por marca
Columnas: `brand_id`, `name`, `subtitle_es`, `subtitle_en`,
`description_es`, `description_en`, `benefits_es` (JSONB array),
`benefits_en` (JSONB array), `image_url`, `logo_url`, `accent_color`,
`specs` (JSONB — EXO'LUTION tiene `vial2_image_url` aquí), `sort_order`

### `pillars` — 4 pilares "por qué elegirnos"
Columnas: `icon_name`, `title_es`, `title_en`, `description_es`,
`description_en`, `sort_order`

### `social_links` — redes sociales
Columnas: `platform`, `label`, `url`, `handle`, `is_active`

---

## IMÁGENES EN SUPABASE STORAGE

Bucket: `brand-assets` (público)
Base URL: `https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/`

Archivos disponibles:
- `logomainesENV06.png` — Logo Maines principal
- `Jetema-removebg-preview.png` — Logo Jetema
- `lifelogo.png` — Logo Xtralife
- `LogoDermclar.png` — Logo Dermclar
- `230216eptq1063.jpg` — Foto producto e.p.t.q. (fondo naranja, muy impactante)
- `eptq0615_0060.jpg` — Foto editorial 3 modelos trajes de colores con e.p.t.q.
- `EPTQ-logo.png` — Logo e.p.t.q.
- `DSC06321.JPG` — Caja TOXTA holográfica
- `DSC06342.JPG` — Frasco TOXTA close-up
- `Asset 1.png` — Logo TOXTA
- `1.png` — Vial EXO'LUTION 1 (burbuja rosa #E91E8C)
- `2.png` — Vial EXO'LUTION 2 (burbuja teal #00BCD4)
- `BI_EXO'LUTION.png` — Logo EXO'LUTION

---

## CAMBIOS PERMITIDOS — LISTA EXACTA

### CAMBIO 1: Hero.tsx — Texto del headline

**Qué cambiar:** Solo el texto del headline principal.
- Actual: "Innovación Médica. Sin Fronteras."
- Nuevo: "Maines SRL." con el mismo estilo de gradiente que tiene el componente
- El subtítulo y descripción: traer desde `site_config` key `hero_subheadline`
  según idioma activo
- Las métricas flotantes (cards laterales): reemplazar con datos reales:
  - `+10` Años de experiencia / Years of experience
  - `3` Marcas Premium / Premium Brands
  - `SCZ` Bolivia (mantener ese card tal cual)
- El botón CTA: texto desde `site_config` key `hero_cta`
- El botón "Contactar Especialista" → "Contacto" scrollea a #contacto

**Lo que NO cambiar:** Layout, animaciones, glassmorphism cards, posiciones.

---

### CAMBIO 2: BrandShowcase.tsx — Reemplazar video por galería de imágenes

**Qué cambiar:** El área donde actualmente hay un placeholder de video
("VER VIDEO CORPORATIVO" con botón play).

**Nuevo comportamiento:** Mostrar las imágenes reales del producto activo.
- Para Jetema activo → mostrar imágenes de sus productos en una galería simple
  con transición automática (autoplay cada 3s) entre:
  `230216eptq1063.jpg`, `DSC06321.JPG`, `DSC06342.JPG`, `1.png`, `2.png`
- Para Xtralife → mostrar el logo `lifelogo.png` con fondo verde oscuro elegante
  (mientras no hay fotos de productos)
- Para Dermclar → mostrar el logo `LogoDermclar.png` con fondo azul oscuro elegante

**Cómo implementarlo:** Reemplazar el div del video player por un componente
`<BrandImageGallery />` que:
- Recibe array de `image_url` de los brand_products de la marca activa
- Hace crossfade entre imágenes con Framer Motion (`AnimatePresence`)
- Mantiene el mismo tamaño/forma del contenedor del video (aspect ratio similar)
- Tiene indicadores de punto (dots) abajo para saber cuál imagen es activa
- Animación de transición: fade + scale sutil (0.95 → 1.0)

**Lo que NO cambiar:** El layout asimétrico, el texto izquierdo, los badges,
los botones "Catálogo Completo" y "Hablar con un asesor", las animaciones de
entrada de la sección.

---

### CAMBIO 3: CorporateGrid.tsx — Reemplazar contenido ficticio por pilares reales

**Qué cambiar:** Los 6 items del bento grid.
- Traer los 4 pilares desde tabla `pillars` de Supabase
- Para los 2 items restantes usar:
  - "Misión": texto desde `site_config` key `mission`
  - "Visión": texto desde `site_config` key `vision`
- Iconos: mapear `icon_name` de Supabase a iconos Lucide React existentes:
  - `shield-check` → `ShieldCheck`
  - `star` → `Star`
  - `zap` → `Zap`
  - `gem` → `Gem`
  - `target` → `Target` (para misión)
  - `eye` → `Eye` (para visión)

**Lo que NO cambiar:** El layout bento, los estilos glassmorphism de cada card,
las animaciones de entrada, los efectos de hover.

---

### CAMBIO 4: Switch ES/EN

**Dónde está:** `useBrandStore.ts` ya tiene la variable `lang`.
`translations.ts` ya tiene la estructura de textos.

**Qué hacer:**
1. Agregar función en el store: `setLang(lang: 'es' | 'en')`
2. En `Navbar.tsx`: el switch ES | EN ya existe visualmente, conectarlo al store
3. Crear helper `useT()` hook que lee `lang` del store y retorna el valor
   correcto de Supabase (`value_es` o `value_en` / `title_es` o `title_en`)
4. Todos los textos que vengan de Supabase deben usar este helper
5. El switch visual: NO cambiar el diseño, solo conectar la funcionalidad

---

### CAMBIO 5: FooterCTA.tsx — Datos de contacto reales

**Qué cambiar:**
- Título y subtítulo: desde `site_config` keys `cta_title`, `cta_subtitle`
- El formulario de contacto: al hacer submit → `mailto:mainesbolivia@gmail.com`
  (o fetch a una API route simple que envíe email)
- Agregar botón WhatsApp junto al formulario:
  URL desde `site_config` key `contact_whatsapp_url`
- Dirección en footer: desde `site_config` key `contact_address`
- Copyright: desde `site_config` key `footer_copyright`
- Redes sociales en footer: desde tabla `social_links`

**Lo que NO cambiar:** Todo el diseño glassmorphism del formulario, el layout,
las columnas del footer, las animaciones.

---

## CÓMO TRAER DATOS DE SUPABASE

Crear en `/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Instalar si no está: `npm install @supabase/supabase-js`

Para Server Components (fetch en el servidor — preferido en Next.js 15):
```typescript
// En page.tsx o layout.tsx
const { data: siteConfig } = await supabase
  .from('site_config')
  .select('key, value_es, value_en')

// Convertir a objeto para fácil acceso:
const config = Object.fromEntries(
  siteConfig.map(row => [row.key, { es: row.value_es, en: row.value_en }])
)
// Uso: config['hero_headline'].es
```

Para Client Components (Zustand store ya existe):
```typescript
// Fetch en useEffect o con SWR/React Query
// Guardar en store si necesita ser compartido
```

**Estrategia recomendada:**
- `page.tsx` (Server Component) → fetch de `site_config` y `brands` → pasa como props
- `BrandShowcase.tsx` (Client Component) → usa el store de Zustand para `activeBrand`
  y fetch de `brand_products` cuando cambia la marca activa
- `CorporateGrid.tsx` → recibe `pillars` como prop desde `page.tsx`

---

## TEXTOS PARA EL HERO (hardcoded de respaldo si Supabase no carga)

```typescript
const fallback = {
  headline: { es: 'Maines SRL.', en: 'Maines SRL.' },
  subheadline: {
    es: 'Importadora premium de salud y estética',
    en: 'Premium health & aesthetics importer'
  },
  description: {
    es: 'Importamos y distribuimos las marcas más innovadoras para Bolivia',
    en: 'We import and distribute the most innovative brands for Bolivia'
  }
}
```

---

## ORDEN DE EJECUCIÓN

1. Instalar Supabase JS: `npm install @supabase/supabase-js`
2. Crear `/src/lib/supabase.ts`
3. Actualizar `useBrandStore.ts` — agregar `lang` + `setLang` + función `t()`
4. Actualizar `page.tsx` — fetch server-side de `site_config`, `brands`, `pillars`
5. Actualizar `Hero.tsx` — headline + métricas reales
6. Actualizar `CorporateGrid.tsx` — pilares desde Supabase
7. Actualizar `BrandShowcase.tsx` — galería de imágenes en lugar de video
8. Actualizar `FooterCTA.tsx` — datos de contacto reales
9. Conectar switch ES/EN en `Navbar.tsx`
10. Verificar con `npm run dev` que todo funciona sin errores TypeScript

---

## LO QUE NUNCA DEBES HACER

- ❌ Cambiar `tailwind.config.ts`
- ❌ Cambiar `globals.css` (especialmente la clase `.glass`)
- ❌ Cambiar `AuroraBackground.tsx` (solo el mapeo de colores por marca si es necesario)
- ❌ Cambiar la paleta de colores del proyecto
- ❌ Cambiar las tipografías (Inter + Space Grotesk)
- ❌ Agregar nuevas librerías de animación (Framer Motion ya está)
- ❌ Cambiar el layout de ninguna sección
- ❌ Cambiar los efectos glassmorphism
- ❌ Romper el TypeScript estricto (arreglar errores de tipo, no ignorarlos)
- ❌ Usar `any` como tipo en TypeScript
- ❌ Hardcodear URLs de imágenes — siempre desde Supabase

---

## DATOS REALES DE LA EMPRESA

Para referencias rápidas sin consultar Supabase:
```
Empresa: Maines SRL
Fundada: 2015
Director: Ing. Tiago Aguiar
Ciudad: Santa Cruz, Bolivia
Email: mainesbolivia@gmail.com
WhatsApp: https://wa.me/59177099888
Teléfono: (+591) 3-3400835
Dirección: Calle San Ramón #3270, Barrio Hamacas, Santa Cruz, Bolivia

Marcas: Jetema (coreana), Xtralife Natural Products (americana), Dermclar (europea)
Productos Jetema: e.p.t.q. (ácido hialurónico), TOXTA (toxina botulínica), EXO'LUTION (skinbooster)
```
