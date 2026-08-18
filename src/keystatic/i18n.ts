/**
 * Configuración de idiomas y URLs localizadas.
 *
 * Es el único sitio donde se declara un idioma. Añadir catalán en fase 2 o
 * quitar un idioma es editar este archivo: el esquema del CMS, el enrutado,
 * el sitemap y los hreflang se generan a partir de aquí.
 */

export const locales = ["en", "es", "ca"] as const;
export type Locale = (typeof locales)[number];

/** Idioma por defecto: sirve `/` y es el `x-default` de los hreflang. */
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ca: "Català",
};

/** `lang`/`hreflang` reales que se emiten en el HTML. */
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  es: "es-ES",
  ca: "ca-ES",
};

/**
 * Segmentos de ruta localizados. El requisito de NACAR es URL localizada, no
 * solo prefijo de idioma: /es/articulo/... y no /es/article/...
 */
export const routeSegments = {
  archive: { en: "archive", es: "archivo", ca: "arxiu" },
  article: { en: "article", es: "articulo", ca: "article" },
  about: { en: "about", es: "sobre-nosotros", ca: "sobre-nosaltres" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeSegments;

export function segment(key: RouteKey, locale: Locale): string {
  return routeSegments[key][locale];
}

/** Construye una URL pública. `home` → `/en`, `/es`, `/ca`. */
export function path(
  locale: Locale,
  key?: RouteKey,
  slug?: string,
): string {
  if (!key) return `/${locale}`;
  const base = `/${locale}/${segment(key, locale)}`;
  return slug ? `${base}/${slug}` : base;
}

/**
 * Resuelve un enlace guardado en el CMS.
 * Los editores escriben o bien una clave de ruta interna («archive»), o bien una
 * URL completa. Así el CMS no guarda rutas localizadas a mano, que es la vía
 * rápida a enlaces rotos al añadir un idioma.
 */
export function resolveHref(href: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  if (href === "home") return path(locale);
  if (href in routeSegments) return path(locale, href as RouteKey);
  return href;
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Negociación simple de `Accept-Language` para el redirect de `/`. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
