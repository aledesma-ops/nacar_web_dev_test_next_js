import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/lib/content";
import { path, type Locale } from "@/keystatic/i18n";

/**
 * Articles item — Figma 0:607 (Article - large)
 * Imagen a sangre + degradado inferior + tarjeta de contenido con blur (glass).
 * Desktop/Tablet: alto 700px, ancho mínimo 600px (2 columnas a 1280).
 * Mobile: alto 460px a ancho completo.
 * Hover: zoom suave de la imagen (State=Hover del componente).
 */
export function ArticleCard({
  article,
  locale,
  priority = false,
}: {
  article: ArticleSummary;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <Link
      href={path(locale, "article", article.slug)}
      className="group relative flex h-[460px] w-full flex-col items-center justify-end overflow-hidden rounded-card p-[10px] tablet:h-[700px] tablet:min-w-[600px] tablet:flex-1"
    >
      <Image
        src={article.image}
        alt={article.imageAlt}
        fill
        sizes="(min-width: 1280px) 620px, 100vw"
        className="pointer-events-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        priority={priority}
      />

      {/* Gradient — Figma I:0:610 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-b from-black/0 to-black/50"
      />

      {/* Content — Figma I:0:611 */}
      <div className="relative z-10 flex w-full flex-col items-start justify-end rounded-chip bg-white/20 p-[12px] text-headline-1 backdrop-blur-[25px]">
        <h2 className="type-p1-semibold w-full">{article.title}</h2>
        <div className="type-p1-semibold flex items-center gap-[4px] whitespace-nowrap">
          <span>{article.categoryLabel}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.date}>{article.dateLabel}</time>
        </div>
      </div>
    </Link>
  );
}
