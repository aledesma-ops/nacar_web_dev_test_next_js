"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import type { ArticleSummary } from "@/lib/content";
import type { Locale } from "@/keystatic/i18n";

/**
 * Filtro por categoría en cliente.
 *
 * Decisión deliberada: filtrar con `searchParams` volvería la ruta dinámica y
 * perdería el prerender, que es justo lo que sostiene el rendimiento de un
 * portfolio con mucha imagen. Con 8 o con 300 artículos esto se aguanta; a
 * partir de ahí toca paginar en servidor.
 */
export function ArchiveGrid({
  articles,
  locale,
  allLabel,
  emptyLabel,
}: {
  articles: ArticleSummary[];
  locale: Locale;
  allLabel: string;
  emptyLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const article of articles) {
      if (!seen.has(article.category)) {
        seen.set(article.category, article.categoryLabel);
      }
    }
    return [...seen.entries()];
  }, [articles]);

  const visible = active
    ? articles.filter((article) => article.category === active)
    : articles;

  return (
    <>
      <div
        role="group"
        aria-label={allLabel}
        className="flex w-full flex-wrap items-center justify-center gap-[8px]"
      >
        {[[null, allLabel] as const, ...categories].map(([value, label]) => {
          const isActive = active === value;
          return (
            <button
              key={value ?? "all"}
              type="button"
              onClick={() => setActive(value)}
              aria-pressed={isActive}
              className={[
                "type-p2 rounded-pill border px-[14px] py-[6px] transition-colors duration-200",
                isActive
                  ? "border-accent-orange bg-accent-orange text-paragraph-2"
                  : "border-paragraph-3 text-paragraph-3 hover:border-headline-1 hover:text-headline-1",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="type-p1 py-[80px] text-paragraph-3">{emptyLabel}</p>
      ) : (
        <section className="flex w-full flex-col flex-wrap items-center justify-center gap-[10px] tablet:flex-row tablet:items-start">
          {visible.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              priority={index < 2}
            />
          ))}
        </section>
      )}
    </>
  );
}
