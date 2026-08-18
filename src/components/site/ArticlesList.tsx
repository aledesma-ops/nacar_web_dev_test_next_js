import { ArticleCard } from "./ArticleCard";
import type { ArticleSummary } from "@/lib/content";
import type { Locale } from "@/keystatic/i18n";

/**
 * Articles list — Figma 0:394
 * flex-wrap con min-width de 600px por tarjeta: 2 columnas a 1280px,
 * 1 columna a 800px, y apilado a ancho completo en móvil.
 */
export function ArticlesList({
  articles,
  locale,
  label,
}: {
  articles: ArticleSummary[];
  locale: Locale;
  label: string;
}) {
  return (
    <section
      aria-label={label}
      className="flex w-full flex-col flex-wrap items-center justify-center gap-[10px] tablet:flex-row tablet:items-start"
    >
      {articles.map((article, index) => (
        <ArticleCard
          key={article.slug}
          article={article}
          locale={locale}
          priority={index < 2}
        />
      ))}
    </section>
  );
}
