import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlesList } from "@/components/site/ArticlesList";
import { CinemaSelects } from "@/components/site/CinemaSelects";
import { FeaturedAlbum } from "@/components/site/FeaturedAlbum";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { Marquee } from "@/components/site/Marquee";
import { Navigation } from "@/components/site/Navigation";
import { Subscribe } from "@/components/site/Subscribe";
import { ButtonLarge } from "@/components/ui/Buttons";
import { isLocale, path } from "@/keystatic/i18n";
import {
  getCinemaRows,
  getHome,
  getHomeArticles,
  getSiteSettings,
} from "@/lib/content";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSiteSettings(locale);

  return {
    title: { absolute: settings.name },
    description: settings.seo.description,
    alternates: alternates(locale),
  };
}

/** Home — Figma 0:541 (Desktop 0:373 · Tablet 0:429 · Mobile 0:485) */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [home, settings, articles, cinema] = await Promise.all([
    getHome(locale),
    getSiteSettings(locale),
    getHomeArticles(locale),
    getCinemaRows(locale),
  ]);

  return (
    <div className="relative flex w-full flex-col items-center">
      <Navigation nav={settings.nav} locale={locale} siteName={settings.name} />

      <Marquee text={home.marquee} />

      <main className="flex w-full max-w-[1800px] flex-col items-center gap-[10px] px-[10px]">
        <Hero
          image={home.hero.image ?? "/images/brand/hero.png"}
          alt={home.hero.alt}
          siteName={settings.name}
        />

        <ArticlesList
          articles={articles}
          locale={locale}
          label={settings.archive.heading}
        />

        <ButtonLarge
          href={path(locale, "archive")}
          label={home.articles.viewAllLabel}
          ariaLabel={`${home.articles.viewAllLabel} — ${settings.archive.heading}`}
        />

        <FeaturedAlbum data={home.featuredAlbum} />

        <CinemaSelects
          heading={home.cinema.heading}
          labels={home.cinema.labels}
          rows={cinema}
        />
      </main>

      <Subscribe data={settings.subscribe} />

      <LocaleSwitcher current={locale} />

      <Footer data={settings.footer} locale={locale} siteName={settings.name} />
    </div>
  );
}
