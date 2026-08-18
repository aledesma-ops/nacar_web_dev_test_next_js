import type { MetadataRoute } from "next";
import { localeHtmlLang, locales, path } from "@/keystatic/i18n";
import { getArticles, getTranslations } from "@/lib/content";
import { absolute } from "@/lib/seo";

/**
 * Sitemap con alternates por idioma. Google usa `alternates.languages` para
 * entender que las tres URLs son la misma pieza de contenido; sin esto, un sitio
 * trilingüe compite consigo mismo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const languagesFor = (
    build: (locale: (typeof locales)[number]) => string | undefined,
  ) =>
    Object.fromEntries(
      locales
        .map((locale) => [localeHtmlLang[locale], build(locale)])
        .filter(([, url]) => url),
    ) as Record<string, string>;

  for (const locale of locales) {
    entries.push({
      url: absolute(path(locale)),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: languagesFor((l) => absolute(path(l))) },
    });

    entries.push({
      url: absolute(path(locale, "archive")),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: languagesFor((l) => absolute(path(l, "archive"))),
      },
    });

    entries.push({
      url: absolute(path(locale, "about")),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: languagesFor((l) => absolute(path(l, "about"))),
      },
    });

    for (const article of await getArticles(locale)) {
      const slugs = await getTranslations(article.translationKey, locales);

      entries.push({
        url: absolute(path(locale, "article", article.slug)),
        lastModified: new Date(article.date),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: languagesFor((l) =>
            slugs[l] ? absolute(path(l, "article", slugs[l]!)) : undefined,
          ),
        },
      });
    }
  }

  return entries;
}
