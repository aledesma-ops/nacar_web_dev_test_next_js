# Grain Archive — Next.js + Tailwind

Implementación de la **Home** del archivo de Figma
[`8uBEKANpU6w1jjTvir9bkV`](https://www.figma.com/design/8uBEKANpU6w1jjTvir9bkV/Untitled?node-id=0-1)
(sección `Home`, nodo `0:541`) en Next.js 15 (App Router, TypeScript) + Tailwind CSS 4.

Desde agosto de 2026 el contenido ya no está hardcodeado: lo sirve un CMS
git-based (Keystatic) con panel en `/keystatic` y el sitio funciona en ES / EN / CA
con URLs localizadas. El modelo de contenido, el flujo editorial y los límites
conocidos están en **[CMS.md](./CMS.md)**.

## Arrancar

```bash
npm install
npm run seed       # solo la primera vez: vuelca el contenido de partida a content/
npm run dev        # sitio en http://localhost:3000 · panel en /keystatic
```

Rutas: `/` redirige al idioma negociado. `/en`, `/es`, `/ca` son las home;
`/es/archivo`, `/ca/arxiu`, `/es/articulo/<slug>` son ejemplos de URL localizada.

Las tipografías (Tilt Warp, Instrument Serif, Geist) se cargan con `next/font/google`,
así que la primera build necesita conexión.

## Assets

El repo incluye **placeholders** en `public/images/` para que la maqueta se vea de
inmediato. Para traer las imágenes reales del diseño:

```bash
npm run fetch:assets
```

El script lee `scripts/figma-assets.json`, donde cada entrada indica el nodo de Figma
de origen y la ruta de destino. **Las URLs de la MCP de Figma caducan a los ~7 días**
(se generaron el 17/08/2026); si fallan, exporta esos assets a mano desde Figma
respetando las rutas del JSON.

El logotipo `Grain Archive` del hero es un SVG que vive en Figma. Mientras no esté en
`public/images/brand/grain-archive-logo.svg`, el componente `Wordmark` cae a un lockup
tipográfico en Tilt Warp del mismo ancho.

## Sistema de diseño

Los tokens salen de las variables de Figma y viven en `src/app/globals.css` dentro de
`@theme` (Tailwind 4 es CSS-first, no hay `tailwind.config.js`).

| Grupo | Token | Uso en clases |
| --- | --- | --- |
| Fondos | `--color-bg-1…7` | `bg-bg-1`, `bg-bg-5` (naranja), `bg-bg-6` (verde), `bg-bg-7` (azul) |
| Texto | `--color-headline-1/2`, `--color-paragraph-1…4` | `text-headline-1`, `text-paragraph-3` |
| Líneas | `--color-divider`, `--color-divider-lines` | `border-divider` |
| Radios | `--radius-card` (8), `--radius-chip` (6), `--radius-pill` (999) | `rounded-card` |

Escala tipográfica como clases de componente: `.type-h1` … `.type-h5`, `.type-p1`,
`.type-p1-semibold`, `.type-p2`, `.type-caption`. El `letterSpacing` de Figma está en
porcentaje y aquí se ha convertido a `em`.

Breakpoints según los frames del diseño:

| Nombre | Ancho | Frame de Figma |
| --- | --- | --- |
| (base) | < 800px | Mobile 375 |
| `tablet:` | ≥ 800px | Tablet 800 |
| `desktop:` | ≥ 1280px | Desktop 1280 |

### Grano

En Figma cada superficie lleva encima un PNG de grano de 1280×600. Aquí se reproduce
con la utilidad `.grain`, que genera la textura con `feTurbulence` (sin assets, escala
infinita). Se ajusta por elemento con `[--grain-opacity:0.2]` y `[--grain-blend:screen]`.
Si prefieres el PNG exacto del diseño, sustituye el `background-image` de `.grain::after`.

## Estructura

```
src/
  app/
    layout.tsx          fuentes, metadata, <body>
    page.tsx            composición de la Home
    globals.css         tokens + escala tipográfica + .grain
  components/
    site/
      Navigation.tsx    Figma 0:594 (variantes Desktop / Mobile)
      Marquee.tsx       0:375
      Hero.tsx          0:378
      Wordmark.tsx      0:381 (con fallback tipográfico)
      ArticleCard.tsx   0:607 (Article - large)
      ArticlesList.tsx  0:394
      FeaturedAlbum.tsx 0:400
      CinemaSelects.tsx 0:409 + Table row 0:685
      Subscribe.tsx     0:426 + Subscribe container 0:694
      Footer.tsx        0:743
    ui/
      NavItem.tsx       0:581 (hover → fondo blanco)
      Buttons.tsx       0:675 large (hover → naranja) · 0:680 small (hover → #1F1F1F)
      PlayIcon.tsx      0:407
  data/site.ts          textos reales extraídos del diseño
```

Cada componente lleva en su cabecera el id del nodo de Figma del que sale, para poder
volver al origen cuando el diseño cambie.

## Decisiones y aproximaciones

- **Contenido**: en el diseño las 4 tarjetas de artículo y las 8 filas de *Cinema
  Selects* repiten el mismo texto de muestra. Se ha respetado tal cual; `src/data/site.ts`
  es el único punto a tocar para conectar datos reales.
- **Tablet**: el diseño define un frame de 800px, pero varios componentes solo tienen
  variantes `Desktop` y `Mobile`. A partir de 800px se usa la variante Desktop, y la
  rejilla de artículos pasa a una columna por el `min-width: 600px` de la tarjeta —
  el mismo comportamiento que en Figma.
- **Perforaciones del ticket de suscripción**: resueltas con círculos CSS en lugar de
  los SVG `Ellipse` del diseño.
- **Cursores personalizados** (`Cursor - default` / `Cursor - hover`, nodos 0:542 y
  0:550): dejados comentados al final de `globals.css`; hay que exportar los PNG.
- **Hover de las tarjetas de artículo**: el componente tiene estado `Hover` en Figma
  pero sin especificar el delta; aquí se ha resuelto con un zoom suave de la imagen.

## Pendiente

Las páginas `/archive`, `/article` y `/about` existen como sección en Figma pero aún no
están implementadas — los enlaces apuntan a esas rutas.
