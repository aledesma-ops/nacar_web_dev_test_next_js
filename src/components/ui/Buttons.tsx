import Link from "next/link";

/**
 * Button - large — Figma 0:675
 * Default: fondo blanco + grano · Hover: fondo naranja (#FF5700)
 * Texto: Header 4 (Instrument Serif italic 80px)
 */
export function ButtonLarge({
  href,
  label,
  ariaLabel,
}: {
  href: string;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      className={[
        "grain [--grain-opacity:0.14] [--grain-blend:multiply]",
        "flex w-full items-center justify-center rounded-card",
        "px-[24px] py-[16px] tablet:py-[32px]",
        "bg-bg-4 text-paragraph-2 text-center",
        "type-h4",
        "transition-colors duration-200 ease-out",
        "hover:bg-bg-5 focus-visible:bg-bg-5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-4",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

/**
 * Button - small — Figma 0:680
 * Default: fondo #0F0E0E + grano · Hover: #1F1F1F
 */
export function ButtonSmall({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "grain [--grain-opacity:0.16] [--grain-blend:screen]",
        "flex items-center justify-center",
        "h-[56px] px-[16px] tablet:h-[68px] tablet:px-[24px]",
        "bg-bg-1 text-paragraph-1 whitespace-nowrap",
        "type-p1-semibold",
        "transition-colors duration-200 ease-out",
        "hover:bg-bg-2 focus-visible:bg-bg-2",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-1",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
