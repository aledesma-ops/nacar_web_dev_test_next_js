import Image from "next/image";
import type { CinemaRow } from "@/lib/content";

export type CinemaLabels = {
  film: string;
  year: string;
  mood: string;
  whyWatch: string;
};

/**
 * Cinema selects section — Figma 0:409
 * Sección clara (#F5F5F5) con textura, título Header 2 y tabla de filas.
 * Desktop (Table row · Viewport=Desktop, Figma 0:686): 4 columnas
 *   Film · Year (160px) · Mood · Why watch (alineada a la derecha).
 * Mobile (Viewport=Mobile, Figma 0:691): 2 columnas — Film · Year.
 * Separadores discontinuos en #555659.
 */
export function CinemaSelects({
  heading,
  labels,
  rows,
}: {
  heading: string;
  labels: CinemaLabels;
  rows: CinemaRow[];
}) {
  if (rows.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-card bg-bg-3 px-[10px] py-[40px] text-paragraph-2 tablet:py-[60px]">
      <Image
        src="/images/brand/cinema-selects-texture.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover mix-blend-multiply"
      />

      <div className="relative z-10 flex flex-col gap-[80px]">
        <h2 className="type-h2 w-full max-w-[360px] tablet:w-[800px] tablet:max-w-none">
          {heading}
        </h2>

        <div className="type-p1-semibold flex w-full flex-col gap-[12px]">
          {/* Labels */}
          <div className="flex w-full items-center gap-[16px] pr-[10px] tablet:pr-0">
            <p className="flex-1 opacity-60">{labels.film}</p>
            <p className="w-[160px] shrink-0 text-right opacity-60 tablet:text-left">
              {labels.year}
            </p>
            <p className="hidden flex-1 opacity-60 tablet:block">{labels.mood}</p>
            <p className="hidden flex-1 text-right opacity-60 tablet:block">
              {labels.whyWatch}
            </p>
          </div>

          {/* Rows */}
          <ul className="flex w-full flex-col">
            {rows.map((row, index) => (
              <li
                key={row.slug}
                className={[
                  "flex w-full items-start gap-[16px] border-b border-dashed border-divider py-[16px]",
                  index === 0 ? "border-t" : "",
                ].join(" ")}
              >
                <p className="flex-1">{row.film}</p>
                <p className="flex-1 text-right tablet:w-[160px] tablet:flex-none tablet:text-left">
                  {row.year}
                </p>
                <p className="hidden flex-1 tablet:block">{row.mood}</p>
                <p className="hidden flex-1 text-right tablet:block">
                  {row.whyWatch}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
