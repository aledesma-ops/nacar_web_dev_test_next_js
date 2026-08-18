import { config } from "@keystatic/core";
import { locales, type Locale } from "./src/keystatic/i18n";
import {
  aboutSingleton,
  articlesCollection,
  cinemaCollection,
  homeSingleton,
  siteSingleton,
} from "./src/keystatic/schema";

/**
 * Almacenamiento.
 *
 * - `local`: escribe en el sistema de ficheros. Es lo que se usa en `npm run dev`.
 * - `github`: el editor entra en /keystatic, se autentica con GitHub y cada
 *   guardado es un commit. Con "Create a new branch" cada cambio abre una rama
 *   → Vercel levanta un preview deploy → se revisa → se hace merge → publica.
 *   Ese es el flujo de borrador / preview / publicación, sin base de datos.
 *
 * Este archivo también se empaqueta en el cliente, así que la variable tiene
 * que ser NEXT_PUBLIC_.
 */
const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO; // "owner/nombre-repo"

const storage = repo
  ? {
      kind: "github" as const,
      repo: { owner: repo.split("/")[0], name: repo.split("/")[1] },
      branchPrefix: "content/",
    }
  : { kind: "local" as const };

/** Genera `{ prefix_en, prefix_es, prefix_ca }` a partir de una fábrica. */
type ByLocale<P extends string, T> = { [K in Locale as `${P}${K}`]: T };

function byLocale<P extends string, T>(
  prefix: P,
  make: (locale: Locale) => T,
): ByLocale<P, T> {
  return Object.fromEntries(
    locales.map((locale) => [`${prefix}${locale}`, make(locale)]),
  ) as ByLocale<P, T>;
}

/**
 * El panel se agrupa por idioma: cada editor entra en su bloque y no ve el
 * resto. Es buena parte de la diferencia entre un CMS usable y uno que el
 * equipo abandona a la tercera semana.
 */
type NavKey =
  | `articles_${Locale}`
  | `cinema_${Locale}`
  | `home_${Locale}`
  | `about_${Locale}`
  | `site_${Locale}`;

const navigation: Record<string, NavKey[]> = Object.fromEntries(
  locales.map((locale) => [
    locale.toUpperCase(),
    [
      `articles_${locale}`,
      `cinema_${locale}`,
      `home_${locale}`,
      `about_${locale}`,
      `site_${locale}`,
    ] satisfies NavKey[],
  ]),
);

export default config({
  storage,
  ui: {
    brand: { name: "Grain Archive" },
    navigation,
  },
  collections: {
    ...byLocale("articles_", articlesCollection),
    ...byLocale("cinema_", cinemaCollection),
  },
  singletons: {
    ...byLocale("home_", homeSingleton),
    ...byLocale("about_", aboutSingleton),
    ...byLocale("site_", siteSingleton),
  },
});
