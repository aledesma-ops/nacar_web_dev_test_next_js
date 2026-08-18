import {
  defaultLocale,
  localeHtmlLang,
  locales,
  path,
  type Locale,
  type RouteKey,
} from "@/keystatic/i18n";

/**
 * URL canónica del sitio. En Vercel se resuelve sola; en local cae a localhost.
 * Define NEXT_PUBLIC_SITE_URL con el dominio definitivo antes de lanzar: de ello
 * dependen los canonical, los hreflang, el sitemap y las imágenes OG.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absolute(pathname: string): string {
  return new URL(pathname, siteUrl()).toString();
}

/**
 * Alternates para `generateMetadata`.
 *
 * `slugs` mapea idioma → slug de esa traducción. Un idioma sin traducción no
 * aparece: declarar un hreflang que devuelve 404 es peor que no declararlo.
 */
export function alternates(
  locale: Locale,
  key?: RouteKey,
  slugs?: Partial<Record<Locale, string>>,
) {
  const languages: Record<string, string> = {};

  for (const other of locales) {
    if (slugs) {
      const slug = slugs[other];
      if (!slug) continue;
      languages[localeHtmlLang[other]] = absolute(path(other, key, slug));
    } else {
      languages[localeHtmlLang[other]] = absolute(path(other, key));
    }
  }

  const canonical = absolute(
    slugs ? path(locale, key, slugs[locale]) : path(locale, key),
  );

  const defaultHref = slugs
    ? slugs[defaultLocale] && absolute(path(defaultLocale, key, slugs[defaultLocale]))
    : absolute(path(defaultLocale, key));

  return {
    canonical,
    languages: defaultHref
      ? { ...languages, "x-default": defaultHref }
      : languages,
  };
}
