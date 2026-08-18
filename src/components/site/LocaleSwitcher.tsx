import Link from "next/link";
import {
  localeNames,
  locales,
  path,
  type Locale,
  type RouteKey,
} from "@/keystatic/i18n";

/**
 * Selector de idioma.
 *
 * `slugs` llega en las páginas de detalle: cada idioma enlaza a *su* slug, no al
 * mismo. Sin eso, cambiar de idioma desde un artículo lleva a un 404, que es el
 * fallo clásico de los sitios multiidioma con URLs localizadas.
 */
export function LocaleSwitcher({
  current,
  route,
  slugs,
}: {
  current: Locale;
  route?: RouteKey;
  slugs?: Partial<Record<Locale, string>>;
}) {
  const available = locales.filter(
    (locale) => !slugs || locale === current || slugs[locale],
  );

  if (available.length < 2) return null;

  return (
    <nav
      aria-label="Idioma"
      className="flex w-full max-w-[1800px] items-center justify-center gap-[8px] px-[20px] pt-[40px]"
    >
      {available.map((locale) => {
        const isCurrent = locale === current;
        const href = slugs
          ? path(locale, route, slugs[locale])
          : path(locale, route);

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            aria-current={isCurrent ? "true" : undefined}
            className={[
              "type-p2 rounded-pill border px-[12px] py-[4px] transition-colors duration-200",
              isCurrent
                ? "border-headline-1 text-headline-1"
                : "border-paragraph-3 text-paragraph-3 hover:border-headline-1 hover:text-headline-1",
            ].join(" ")}
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
