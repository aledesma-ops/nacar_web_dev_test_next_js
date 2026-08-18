import Link from "next/link";

/**
 * Nav item — Figma 0:581
 * Variantes: Default 1/2/3 (naranja cuadrado, verde píldora, azul redondeado 6)
 * Hover: en las tres variantes el fondo pasa a blanco (#FFFFFF).
 */

export type NavItemVariant = "orange" | "green" | "blue";

const variantStyles: Record<NavItemVariant, string> = {
  orange: "bg-bg-5 rounded-none",
  green: "bg-bg-6 rounded-pill",
  blue: "bg-bg-7 rounded-chip",
};

type NavItemProps = {
  href: string;
  label: string;
  variant: NavItemVariant;
  "aria-label"?: string;
};

export function NavItem({ href, label, variant, ...rest }: NavItemProps) {
  return (
    <Link
      href={href}
      className={[
        "grain [--grain-opacity:0.14] [--grain-blend:multiply]",
        "flex items-center justify-center",
        "px-[12px] py-[8px] tablet:p-[12px]",
        "text-paragraph-2 whitespace-nowrap",
        "text-[18px] tablet:text-[20px] font-semibold leading-[1.4] tracking-[-0.02em]",
        "transition-colors duration-200 ease-out",
        "hover:bg-bg-4 focus-visible:bg-bg-4",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-4",
        variantStyles[variant],
      ].join(" ")}
      {...rest}
    >
      {label}
    </Link>
  );
}
