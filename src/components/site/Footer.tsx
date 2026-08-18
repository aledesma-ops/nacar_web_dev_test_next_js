import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { resolveHref, type Locale } from "@/keystatic/i18n";

export type FooterData = {
  columns: readonly {
    label: string;
    links: readonly { label: string; href: string }[];
  }[];
  copyright: string;
  tagline: string;
};

/**
 * Footer — Figma 0:743
 * Breakpoint=Desktop (0:744): "Grain / Archive" en Header 1 (200px) a la izquierda
 *   y bloque de enlaces alineado a la derecha.
 * Breakpoint=Mobile (0:797): logotipo a ancho completo arriba y enlaces en dos
 *   columnas alineadas a la izquierda.
 */
export function Footer({
  data,
  locale,
  siteName,
}: {
  data: FooterData;
  locale: Locale;
  siteName: string;
}) {
  const [firstWord, ...restWords] = siteName.split(" ");

  return (
    <footer className="flex w-full flex-col items-center justify-end gap-[80px] px-[20px] pt-[40px] pb-[20px] tablet:flex-row tablet:items-end tablet:justify-center tablet:gap-[40px] tablet:pt-[120px]">
      {/* Logotipo: texto gigante en desktop, lockup en móvil */}
      <div className="w-full tablet:hidden">
        <Wordmark />
      </div>
      <h2 className="type-h1 hidden flex-1 text-headline-1 tablet:block">
        {firstWord}
        <br />
        {restWords.join(" ")}
      </h2>

      <div className="flex w-full flex-col gap-[80px] tablet:w-auto tablet:items-end tablet:gap-[100px]">
        <div className="flex w-full gap-[40px] tablet:w-auto tablet:gap-[80px]">
          {data.columns.map((column) => (
            <div
              key={column.label}
              className="flex flex-1 flex-col items-start gap-[6px] tablet:w-[140px] tablet:flex-none tablet:items-end"
            >
              <div className="flex items-center justify-end rounded-pill border border-paragraph-4 px-[5px] py-[2px]">
                <h2 className="type-caption whitespace-nowrap text-paragraph-4">
                  {column.label}
                </h2>
              </div>
              <ul className="flex w-full flex-col items-start text-left tablet:items-end tablet:text-right">
                {column.links.map((link) => {
                  const href = resolveHref(link.href, locale);
                  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

                  return (
                    <li key={link.label}>
                      <Link
                        href={href}
                        className="type-p1 whitespace-nowrap text-paragraph-4 underline decoration-solid transition-colors duration-200 hover:text-headline-1"
                        {...(isExternal
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="type-p2 w-full text-left text-paragraph-4 tablet:text-right">
          <p>{data.copyright}</p>
          <p>{data.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
