import { createReader } from "@keystatic/core/reader";
import type { DocumentRendererProps } from "@keystatic/core/renderer";
import keystaticConfig from "../../keystatic.config";
import { localeHtmlLang, type Locale } from "@/keystatic/i18n";

/**
 * Capa de datos: única frontera entre el CMS y los componentes.
 *
 * Los componentes reciben view models planos, no entradas de Keystatic. Eso es
 * lo que permite cambiar de CMS más adelante (Sanity, Storyblok) tocando solo
 * este archivo, que es exactamente el riesgo de portabilidad que el decision
 * stack marcaba como bajo en las opciones git-based.
 */

const reader = createReader(process.cwd(), keystaticConfig);

/**
 * En producción los borradores no se sirven. En los preview deploys de Vercel
 * sí: es lo que hace revisable una rama de contenido antes del merge.
 */
const showDrafts = process.env.VERCEL_ENV !== "production";

// --- View models ------------------------------------------------------------

export type ArticleSummary = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  date: string;
  dateLabel: string;
  image: string;
  imageAlt: string;
  introBlurb: string;
  featured: boolean;
  translationKey: string;
};

export type ArticleDetail = ArticleSummary & {
  header: { src: string | null; alt: string };
  seo: { title: string; description: string; ogImage: string | null };
  content: () => Promise<DocumentRendererProps["document"]>;
};

export type CinemaRow = {
  slug: string;
  film: string;
  year: string;
  mood: string;
  whyWatch: string;
};

// --- Helpers ----------------------------------------------------------------

const articlesFor = (locale: Locale) =>
  reader.collections[`articles_${locale}` as const];
const cinemaFor = (locale: Locale) =>
  reader.collections[`cinema_${locale}` as const];

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  en: { film: "Film", music: "Music", visual: "Visual" },
  es: { film: "Cine", music: "Música", visual: "Visual" },
  ca: { film: "Cinema", music: "Música", visual: "Visual" },
};

export function categoryLabel(category: string, locale: Locale): string {
  return CATEGORY_LABELS[locale][category] ?? category;
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeHtmlLang[locale], {
    month: "short",
    day: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`));
}

// --- Artículos --------------------------------------------------------------

export async function getArticles(locale: Locale): Promise<ArticleSummary[]> {
  const entries = await articlesFor(locale).all();

  return entries
    .filter(({ entry }) => showDrafts || !entry.draft)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      category: entry.category,
      categoryLabel: categoryLabel(entry.category, locale),
      date: entry.datePublished,
      dateLabel: formatDate(entry.datePublished, locale),
      image: entry.thumbnail.src ?? "",
      imageAlt: entry.thumbnail.alt,
      introBlurb: entry.introBlurb,
      featured: entry.featured,
      translationKey: entry.translationKey,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Los cuatro que ocupan la parrilla de la home: destacados primero. */
export async function getHomeArticles(locale: Locale, limit = 4) {
  const all = await getArticles(locale);
  const featured = all.filter((a) => a.featured);
  const rest = all.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getArticle(
  locale: Locale,
  slug: string,
): Promise<ArticleDetail | null> {
  const entry = await articlesFor(locale).read(slug);
  if (!entry) return null;
  if (entry.draft && !showDrafts) return null;

  return {
    slug,
    title: entry.title,
    category: entry.category,
    categoryLabel: categoryLabel(entry.category, locale),
    date: entry.datePublished,
    dateLabel: formatDate(entry.datePublished, locale),
    image: entry.thumbnail.src ?? "",
    imageAlt: entry.thumbnail.alt,
    introBlurb: entry.introBlurb,
    featured: entry.featured,
    translationKey: entry.translationKey,
    header: { src: entry.header.src, alt: entry.header.alt },
    seo: {
      title: entry.seo.title || entry.title,
      description: entry.seo.description || entry.introBlurb,
      ogImage: entry.seo.ogImage || entry.header.src || entry.thumbnail.src,
    },
    content: entry.content,
  };
}

/**
 * Traducciones de un mismo contenido, por `translationKey`.
 * Es lo que alimenta los hreflang y el selector de idioma: sin esto habría que
 * asumir que el slug es igual en los tres idiomas, y entonces las URLs dejan
 * de estar localizadas.
 */
export async function getTranslations(
  translationKey: string,
  locales: readonly Locale[],
): Promise<Partial<Record<Locale, string>>> {
  const pairs = await Promise.all(
    locales.map(async (locale) => {
      const entries = await articlesFor(locale).all();
      const match = entries.find(
        ({ entry }) => entry.translationKey === translationKey,
      );
      return [locale, match?.slug] as const;
    }),
  );

  return Object.fromEntries(pairs.filter(([, slug]) => slug)) as Partial<
    Record<Locale, string>
  >;
}

// --- Cinema selects ---------------------------------------------------------

export async function getCinemaRows(locale: Locale): Promise<CinemaRow[]> {
  const entries = await cinemaFor(locale).all();

  return entries
    .filter(({ entry }) => showDrafts || !entry.draft)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
    .map(({ slug, entry }) => ({
      slug,
      film: entry.title,
      year: String(entry.year),
      mood: entry.mood,
      whyWatch: entry.whyWatch,
    }));
}

// --- Singletons -------------------------------------------------------------

export async function getHome(locale: Locale) {
  const home = await reader.singletons[`home_${locale}` as const].read();
  if (!home) throw new Error(`Falta content/settings/${locale}/home.yaml`);
  return home;
}

export async function getAbout(locale: Locale) {
  return reader.singletons[`about_${locale}` as const].read();
}

export async function getSiteSettings(locale: Locale) {
  const site = await reader.singletons[`site_${locale}` as const].read();
  if (!site) throw new Error(`Falta content/settings/${locale}/site.yaml`);
  return site;
}

export type HomeContent = Awaited<ReturnType<typeof getHome>>;
export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
