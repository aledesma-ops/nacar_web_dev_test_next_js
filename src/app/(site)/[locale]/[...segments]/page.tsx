import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArchiveGrid } from "@/components/site/ArchiveGrid";
import { Footer } from "@/components/site/Footer";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { Marquee } from "@/components/site/Marquee";
import { Navigation } from "@/components/site/Navigation";
import { Prose } from "@/components/site/Prose";
import { Subscribe } from "@/components/site/Subscribe";
import {
  isLocale,
  locales,
  segment,
  type Locale,
  type RouteKey,
} from "@/keystatic/i18n";
import {
  getAbout,
  getArticle,
  getArticles,
  getHome,
  getSiteSettings,
  getTranslations,
} from "@/lib/content";
import { alternates } from "@/lib/seo";

/**
 * Ruta única para archivo, detalle y «sobre».
 *
 * En vez de reescribir URLs en el middleware, la ruta resuelve el segmento
 * localizado contra el mapa de i18n. Así la URL que se prerenderiza es
 * exactamente la URL pública (/es/articulo/... y no /es/article/...), sin capa
 * de traducción en medio que se pueda desincronizar.
 */

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; segments: string[] }> };

type Resolved =
  | { kind: "archive" }
  | { kind: "about" }
  | { kind: "article"; slug: string }
  | null;

function resolve(locale: Locale, segments: string[]): Resolved {
  if (segments.length === 1) {
    if (segments[0] === segment("archive", locale)) return { kind: "archive" };
    if (segments[0] === segment("about", locale)) return { kind: "about" };
  }
  if (segments.length === 2 && segments[0] === segment("article", locale)) {
    return { kind: "article", slug: segments[1] };
  }
  return null;
}

export async function generateStaticParams() {
  const params: { locale: string; segments: string[] }[] = [];

  for (const locale of locales) {
    params.push({ locale, segments: [segment("archive", locale)] });
    params.push({ locale, segments: [segment("about", locale)] });

    const articles = await getArticles(locale);
    for (const article of articles) {
      params.push({
        locale,
        segments: [segment("article", locale), article.slug],
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = await params;
  if (!isLocale(locale)) return {};

  const resolved = resolve(locale, segments);
  if (!resolved) return {};

  const settings = await getSiteSettings(locale);

  if (resolved.kind === "archive") {
    return {
      title: settings.archive.heading,
      description: settings.archive.intro,
      alternates: alternates(locale, "archive"),
    };
  }

  if (resolved.kind === "about") {
    const about = await getAbout(locale);
    return {
      title: about?.title ?? "About",
      description: about?.intro ?? settings.seo.description,
      alternates: alternates(locale, "about"),
    };
  }

  const article = await getArticle(locale, resolved.slug);
  if (!article) return {};

  const slugs = await getTranslations(article.translationKey, locales);

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: alternates(locale, "article", slugs),
    openGraph: {
      type: "article",
      title: article.seo.title,
      description: article.seo.description,
      publishedTime: article.date,
      images: article.seo.ogImage ? [{ url: article.seo.ogImage }] : undefined,
    },
  };
}

// ---------------------------------------------------------------------------

export default async function SegmentsPage({ params }: Props) {
  const { locale, segments } = await params;
  if (!isLocale(locale)) notFound();

  const resolved = resolve(locale, segments);
  if (!resolved) notFound();

  const [home, settings] = await Promise.all([
    getHome(locale),
    getSiteSettings(locale),
  ]);

  const chrome = (
    body: React.ReactNode,
    route: RouteKey,
    slugs?: Partial<Record<Locale, string>>,
  ) => (
    <div className="relative flex w-full flex-col items-center">
      <Navigation nav={settings.nav} locale={locale} siteName={settings.name} />
      <Marquee text={home.marquee} />
      {body}
      <Subscribe data={settings.subscribe} />
      <LocaleSwitcher current={locale} route={route} slugs={slugs} />
      <Footer data={settings.footer} locale={locale} siteName={settings.name} />
    </div>
  );

  // --- Archivo -------------------------------------------------------------
  if (resolved.kind === "archive") {
    const articles = await getArticles(locale);

    return chrome(
      <main className="flex w-full max-w-[1800px] flex-col items-center gap-[40px] px-[10px] pt-[160px]">
        <header className="flex w-full flex-col items-start gap-[16px]">
          <h1 className="type-h3 text-headline-1">{settings.archive.heading}</h1>
          <p className="type-p1 max-w-[720px] text-paragraph-3">
            {settings.archive.intro}
          </p>
        </header>

        <ArchiveGrid
          articles={articles}
          locale={locale}
          allLabel={settings.archive.allLabel}
          emptyLabel={settings.archive.emptyLabel}
        />
      </main>,
      "archive",
    );
  }

  // --- Sobre ---------------------------------------------------------------
  if (resolved.kind === "about") {
    const about = await getAbout(locale);
    if (!about) notFound();

    return chrome(
      <main className="flex w-full max-w-[1800px] flex-col items-center gap-[40px] px-[10px] pt-[160px]">
        <header className="flex w-full flex-col items-start gap-[16px]">
          <h1 className="type-h3 text-headline-1">{about.title}</h1>
          {about.intro ? (
            <p className="type-p1 max-w-[720px] text-paragraph-3">{about.intro}</p>
          ) : null}
        </header>
        <div className="flex w-full justify-center py-[40px]">
          <Prose document={await about.content()} />
        </div>
      </main>,
      "about",
    );
  }

  // --- Detalle de artículo -------------------------------------------------
  const article = await getArticle(locale, resolved.slug);
  if (!article) notFound();

  const slugs = await getTranslations(article.translationKey, locales);
  const headerImage = article.header.src ?? article.image;

  return chrome(
    <main className="flex w-full max-w-[1800px] flex-col items-center gap-[10px] px-[10px]">
      <article className="flex w-full flex-col items-center gap-[40px]">
        <header className="relative flex h-[520px] w-full flex-col items-start justify-end overflow-hidden rounded-card p-[20px] tablet:h-[700px]">
          <Image
            src={headerImage}
            alt={article.header.alt || article.imageAlt}
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-b from-black/0 to-black/70"
          />
          <div className="relative z-10 flex w-full max-w-[1200px] flex-col gap-[12px]">
            <p className="type-caption flex items-center gap-[8px] text-headline-1">
              <span>{article.categoryLabel}</span>
              <span aria-hidden>·</span>
              <time dateTime={article.date}>{article.dateLabel}</time>
            </p>
            <h1 className="type-h3 max-w-[1000px] text-headline-1">
              {article.title}
            </h1>
          </div>
        </header>

        <div className="flex w-full max-w-[720px] flex-col gap-[32px] py-[40px]">
          <p className="type-h4 text-headline-1">{article.introBlurb}</p>
          <Prose document={await article.content()} />
        </div>
      </article>
    </main>,
    "article",
    slugs,
  );
}
