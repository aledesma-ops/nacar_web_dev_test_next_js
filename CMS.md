# CMS — Grain Archive

Vertical slice del stack propuesto para NACAR, con una variante: el contenido no
vive en un CMS alojado sino en **este mismo repositorio de GitHub**, editado
desde un panel propio en `/keystatic`.

---

## Qué se ha montado

| Pieza | Dónde | Qué resuelve |
|---|---|---|
| Esquema de contenido | `src/keystatic/schema.ts` | Las dos colecciones de Figma Sites (Articles, Cinema selects) más todo el texto que estaba hardcodeado |
| Idiomas y URLs | `src/keystatic/i18n.ts` | ES / EN / CA con URL localizada, no solo prefijo |
| Panel de edición | `/keystatic` | Alta, edición y publicación sin tocar código |
| Capa de datos | `src/lib/content.ts` | Única frontera entre CMS y componentes |
| SEO | `src/lib/seo.ts`, `src/app/sitemap.ts` | Canonical, hreflang, x-default, sitemap con alternates |
| Seed | `scripts/seed-content.mjs` | Vuelca el contenido de partida a `content/` |

38 rutas se generan estáticas en build: 3 idiomas × (home + archivo + sobre + 8
artículos), más sitemap y robots.

---

## Modelo de contenido

```
content/
├── articles/{en,es,ca}/*.mdoc      ← una colección por idioma
├── cinema/{en,es,ca}/*.yaml
└── settings/{en,es,ca}/
    ├── home.yaml                   ← marquesina, hero, álbum destacado, cabeceras
    ├── site.yaml                   ← nav, pie, suscripción, SEO por defecto
    └── about.mdoc
```

**Artículos** — Title, Category, Date published, Image (thumbnail), Image
(header), Intro blurb, Content, Slug. Es el modelo de tu tabla de Figma Sites,
más tres campos que esa tabla no tenía y que hacen falta para publicar en serio:

- `translationKey` — misma cadena en las tres versiones. Es lo que enlaza los
  idiomas. Sin él habría que asumir que el slug es idéntico en los tres, y
  entonces las URLs dejan de estar localizadas.
- `draft` — no se publica en producción, pero sí se ve en los preview deploys.
- `seo` — título, meta descripción e imagen OG opcionales, con caídas sensatas.

**Cinema selects** — Title, Year, Mood, Why watch, Slug, más `order` para
controlar la posición en la tabla de la home.

### Por qué una colección por idioma y no un campo de idioma

Keystatic no tiene i18n nativo, así que hay dos patrones posibles. Este elige
separar por carpeta porque: el editor solo ve su idioma, los slugs son
independientes (que es el requisito de URL localizada), y las traducciones
quedan como archivos distintos, así que una PR de traducción es legible.

El coste: alta un contenido nuevo = crearlo tres veces. Con volumen alto,
conviene un script que clone el esqueleto entre idiomas.

---

## Flujo editorial

**En local**

```bash
npm install
npm run seed     # solo la primera vez
npm run dev      # panel en http://localhost:3000/keystatic
```

**En producción (GitHub)**

1. El editor entra en `/keystatic` y se autentica con su cuenta de GitHub.
2. Edita. Cada guardado es un commit.
3. Con «Create a new branch», los cambios van a una rama `content/...` en vez de
   a `main`.
4. Vercel levanta un preview deploy de esa rama: el equipo ve la web real, con
   los borradores visibles y `robots: disallow` puesto.
5. Merge a `main` → build → publicado.

Eso es borrador, previsualización y publicación sin base de datos, sin panel
expuesto y sin webhooks de revalidación: al ser contenido del repo, un commit ya
dispara el build.

### Puesta en marcha del modo GitHub

1. Desplegar el proyecto en Vercel.
2. Definir `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo`.
3. Entrar en `https://tu-dominio/keystatic/setup` y seguir el asistente: crea la
   GitHub App y devuelve `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET` y `KEYSTATIC_SECRET`.
4. Cargarlas en Vercel y redeployar.
5. Invitar a los editores como colaboradores del repositorio.

---

## Lo que hay que mirar de frente antes de dar esto por bueno

**1. Cada editor necesita cuenta de GitHub y ser colaborador del repositorio.**
Es el punto débil real de esta opción frente a un CMS alojado, y toca justo el
criterio que más pesaba en el decision stack: autonomía editorial sin dev. El
panel en sí no pide saber Git —se ve como un CMS normal— pero el alta sí pasa
por GitHub, y las ramas de contenido se resuelven con merges. Si el equipo de
Nacar es no técnico, esto se prueba con ellos antes de firmar, no después.

**2. No hay roles ni permisos por colección.** Quien tiene acceso al repo tiene
acceso a todo el contenido, en los tres idiomas. GitHub permite acotar por rama
protegida, no por tipo de contenido.

**3. No hay edición visual.** Se edita en formulario, se previsualiza en el
preview deploy. Es un paso atrás respecto al visual editing de Sanity, que el
decision stack marcaba como condición para que el equipo publique sin ayuda.

**4. Publicar es hacer build.** Con 24 artículos son segundos. Con cientos de
piezas media-heavy, el tiempo de build se convierte en el techo. Cuando eso
llegue, la salida es ISR con revalidación por webhook.

**5. La imagen sube al repositorio.** Sin CDN de assets ni transformaciones. Para
un portfolio con mucha imagen pesada, el repo crece rápido; conviene decidir
pronto si las imágenes van a un bucket con CDN.

Ninguno es bloqueante para el slice. Los cinco son exactamente lo que este slice
tiene que responder con el equipo delante.

---

## Cómo se cambia lo que suele cambiar

**Añadir o quitar un idioma** → `src/keystatic/i18n.ts`. Añadir `pt` a `locales`
y su fila en `routeSegments` genera las colecciones, el enrutado, los hreflang y
el sitemap. Solo queda crear los archivos de `content/settings/pt/`.

**Cambiar una URL localizada** → `routeSegments`. Ojo: cambiar un segmento ya
publicado rompe enlaces; toca redirección en `next.config.ts`.

**Añadir un campo** → `src/keystatic/schema.ts` y después mapearlo en
`src/lib/content.ts`. Los componentes no leen del CMS directamente, así que el
cambio queda contenido.

**Cambiar el idioma por defecto** → `defaultLocale` en `i18n.ts`. Afecta al
redirect de `/` y al `x-default`.

**Migrar a otro CMS** → reescribir `src/lib/content.ts` manteniendo las mismas
funciones. Los componentes reciben view models planos, no entradas de Keystatic:
esa frontera es deliberada y es lo que mantiene barata la salida.
