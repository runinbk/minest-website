# MEJORAS v2 — maines-demo-2
> Instrucciones precisas para Claude Code
> LEER COMPLETO antes de tocar cualquier archivo

---

## REGLA PRINCIPAL (igual que siempre)
NO cambiar estructura de componentes, NO cambiar tipografías, NO cambiar
el sistema glassmorphism. Solo los cambios listados abajo, en orden.

---

## CAMBIO 1 — Fondo aurora: eliminar amarillo, reemplazar por plateado/gris

**Archivo:** `src/components/AuroraBackground.tsx`

El aurora background actualmente tiene tonos amarillo/ámbar cuando no hay
marca activa (estado inicial). Cambiar los colores del estado por defecto
y de la marca "maines" a tonos grises plateados neutros y elegantes.

**Colores actuales del estado default/maines:** algo como `#fcd34d` (amarillo).
**Colores nuevos para default/maines:**
```typescript
// Primary bubble: gris plateado azulado
primary: '#94A3B8'   // slate-400
// Secondary bubble: gris más claro
secondary: '#CBD5E1' // slate-300
```

Esto afecta SOLO el estado sin marca activa o con marca "maines" seleccionada.
Los colores de Jetema (azul), Xtralife (verde), Dermclar (azul oscuro) NO cambian.

---

## CAMBIO 2 — Reordenar secciones en page.tsx

**Archivo:** `src/app/page.tsx`

Orden ACTUAL (aproximado):
1. Hero
2. CorporateGrid (Por qué elegirnos)
3. BrandShowcase (Marcas individuales)
4. FooterCTA (¿Querés ser distribuidor?)
5. Footer

Orden NUEVO requerido:
1. Hero
2. BrandShowcase — PRIMERO las marcas
3. CorporateGrid — DESPUÉS el por qué elegirnos
4. FooterCTA
5. Footer

Solo mover el orden en el JSX de page.tsx. No tocar nada interno de los componentes.

---

## CAMBIO 3 — Botón "Catálogo Completo" → abrir PDF desde Supabase Storage

**Archivos:** `src/components/BrandShowcase.tsx`

El botón "Catálogo Completo" que aparece en cada marca actualmente no hace nada
o va a un href vacío.

**Nueva funcionalidad:**
1. Subir el PDF del catálogo a Supabase Storage bucket `brand-assets` con nombre
   `catalogo-maines.pdf` (el usuario lo sube manualmente al storage)
2. El botón abre el PDF en una nueva pestaña:

```typescript
const CATALOG_URL = 'https://ggkwhnuqwktfoynxkgsi.supabase.co/storage/v1/object/public/brand-assets/catalogo-maines.pdf'

// En el botón:
<a
  href={CATALOG_URL}
  target="_blank"
  rel="noopener noreferrer"
>
  Catálogo Completo
</a>
```

3. Si el PDF no existe aún (404), el botón igual debe estar presente pero mostrar
   un tooltip "Próximamente" al hacer hover — usar el estado:

```typescript
const [catalogAvailable, setCatalogAvailable] = useState(false)

useEffect(() => {
  fetch(CATALOG_URL, { method: 'HEAD' })
    .then(r => setCatalogAvailable(r.ok))
    .catch(() => setCatalogAvailable(false))
}, [])
```

Mantener el estilo visual exacto del botón. Solo cambiar el comportamiento del click.

---

## CAMBIO 4 — Footer: links interactivos con hover

**Archivo:** `src/components/FooterCTA.tsx` (o donde esté el footer)

Los datos de contacto en el footer deben ser clickeables y abrir la app correcta:

```typescript
// Dirección → Google Maps
<a
  href="https://maps.google.com/?q=-17.7554465,-63.1675686"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-blue-600 transition-colors cursor-pointer"
>
  Calle San Ramón #3270, Barrio Hamacas, Santa Cruz, Bolivia
</a>

// Teléfono → WhatsApp (no llamada, porque es empresarial)
<a href="https://wa.me/59177099888">
  (+591) 3-3400835
</a>

// Email → cliente de correo
<a href="mailto:mainesbolivia@gmail.com">
  mainesbolivia@gmail.com
</a>
```

Agregar en cada link: `className` con `hover:underline hover:opacity-80 transition-all`
manteniendo los colores actuales del texto.

---

## CAMBIO 5 — Footer: corregir año y eliminar "Bolivia Internacional"

**Archivo:** Footer (FooterCTA.tsx o componente de footer)

- Cambiar `© 2025` → `© 2026`
- Eliminar completamente el texto "Bolivia" y "Internacional" del footer
  (los dos links/textos en la esquina inferior derecha)
- Si vienen de site_config de Supabase, actualizar el valor en la DB:
  ```sql
  UPDATE site_config SET value_es = '© 2026 Maines SRL. Todos los derechos reservados.',
  value_en = '© 2026 Maines SRL. All rights reserved.'
  WHERE key = 'footer_copyright';
  ```

---

## CAMBIO 6 — Scroll snapping suave entre secciones (SOLO DESKTOP)

**Archivos:** `src/app/globals.css` y `src/app/page.tsx`

Implementar scroll snap solo en viewport desktop (≥1024px).

**En globals.css:**
```css
@media (min-width: 1024px) {
  html {
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  /* Cada sección hace snap */
  section[data-snap] {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
  }
}

/* Mobile: scroll normal sin snap */
@media (max-width: 1023px) {
  html {
    scroll-snap-type: none;
  }
}
```

**En page.tsx**, agregar `data-snap` a cada sección principal:
```tsx
<section data-snap id="hero">
  <Hero />
</section>

<section data-snap id="marcas">
  <BrandShowcase />
</section>

<section data-snap id="nosotros">
  <CorporateGrid />
</section>

<section data-snap id="contacto">
  <FooterCTA />
</section>
```

**IMPORTANTE:** Si alguna sección tiene contenido más alto que 100vh (como
CorporateGrid o BrandShowcase), NO usar `scroll-snap-stop: always` en esa
sección — usar solo `scroll-snap-align: start` sin el stop para que se pueda
scrollear dentro de ella antes de pasar a la siguiente.

Regla práctica:
- Hero → `scroll-snap-stop: always` (es exactamente 100vh)
- BrandShowcase → sin stop (tiene contenido largo)
- CorporateGrid → sin stop (6 cards, puede ser largo)
- FooterCTA → `scroll-snap-stop: always`

---

## CAMBIO 7 — Sección BrandShowcase: agregar más información de productos

**Archivo:** `src/components/BrandShowcase.tsx`

Actualmente la sección muestra: tagline, descripción general, 4 benefits, 
botones. Falta mostrar los productos individuales de cada marca.

**Agregar debajo de los benefits actuales** (antes de los botones) una sub-sección
de productos con tabs o cards pequeñas:

Para **Jetema** (3 productos: e.p.t.q., TOXTA, EXO'LUTION):
```tsx
// Mini tabs de productos debajo del texto principal
<div className="flex gap-2 mt-4 mb-4">
  {products.map(product => (
    <button
      key={product.id}
      onClick={() => setActiveProduct(product.id)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all
        ${activeProduct === product.id
          ? 'bg-brand-accent text-white'
          : 'bg-white/20 text-current hover:bg-white/30'
        }`}
    >
      {product.name}
    </button>
  ))}
</div>

// Info del producto activo
<AnimatePresence mode="wait">
  <motion.div
    key={activeProduct}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <p className="text-sm opacity-80">{currentProduct.subtitle}</p>
    <ul className="mt-2 space-y-1">
      {currentProduct.benefits.map((b, i) => (
        <li key={i} className="flex items-center gap-2 text-xs opacity-70">
          <span className="w-1 h-1 rounded-full bg-current" />
          {b}
        </li>
      ))}
    </ul>
  </motion.div>
</AnimatePresence>
```

Los datos de `products` vienen del fetch a `brand_products` filtrado por
`brand_id` de la marca activa (ya debería estar implementado del sprint anterior).

La imagen del lado derecho (galería) debe cambiar según el producto activo:
mostrar `product.image_url` del producto seleccionado.

Para **Xtralife** y **Dermclar**: si tienen menos productos, mostrar igual
con los que haya. Si solo hay el logo, mantener el logo grande centrado.

---

## CAMBIO 8 — "Nuestras Marcas" overview: mejorar las cards de overview

**Contexto:** En la imagen 4 (screenshot) se ve una sección "Nuestras Marcas"
con 3 cards simples (logo + nombre + tagline + "Explorar Portafolio").

Si esta sección existe como componente separado del BrandShowcase individual,
mejorar las cards así:
- Agregar el `short_desc` de cada marca debajo del tagline
- Agregar los iconos de redes sociales (Instagram, TikTok) de cada marca
  como links pequeños en la parte inferior de la card
- Hover en la card: scale(1.02) + sombra más pronunciada (ya con Framer Motion)
- El botón "Explorar Portafolio" → scroll hacia la sección de esa marca

Si NO existe como componente separado (es parte del BrandShowcase), ignorar
este cambio.

---

## ARCHIVOS QUE NO TOCAR (recordatorio)
- `tailwind.config.ts`
- `tsconfig.json`
- `next.config.ts`
- `src/lib/utils.ts`
- `src/store/useBrandStore.ts` (solo si es necesario para lang/setLang)
- Cualquier archivo en `src/components/ui/` (shadcn)

---

## ORDEN DE EJECUCIÓN

1. Cambio 5 → SQL en Supabase (30 segundos, fuera del código)
2. Cambio 1 → AuroraBackground colors (bajo riesgo)
3. Cambio 2 → Reordenar page.tsx (bajo riesgo)
4. Cambio 4 → Links footer (bajo riesgo)
5. Cambio 5 → Año y eliminar Bolivia/Internacional
6. Cambio 3 → Botón catálogo PDF
7. Cambio 7 → Mini tabs de productos en BrandShowcase (mayor complejidad)
8. Cambio 6 → Scroll snap (probar bien en desktop y mobile)
9. Cambio 8 → Cards overview (si aplica)

Correr `npm run dev` y verificar visualmente después de cada cambio.
Correr `npx tsc --noEmit` al final para verificar que no hay errores TypeScript.

---

## NOTA SOBRE EL CATÁLOGO PDF

El cliente (Maines SRL) debe subir el PDF del catálogo manualmente a:
Supabase Dashboard → Storage → brand-assets → Upload → `catalogo-maines.pdf`

Hasta que lo suba, el botón muestra tooltip "Próximamente" según la lógica
del Cambio 3. Una vez subido, funciona automáticamente sin tocar código.
