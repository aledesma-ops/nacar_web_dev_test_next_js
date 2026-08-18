import Link from "next/link";
import { NavItem, type NavItemVariant } from "@/components/ui/NavItem";
import { path, resolveHref, type Locale } from "@/keystatic/i18n";

export type NavLink = { label: string; route: string; variant: string };

/**
 * Navigation — Figma 0:594
 * Breakpoint=Desktop (0:595): logo 44px a la izquierda, links centrados, spacer 44px.
 * Breakpoint=Mobile  (0:602): sin logo, links centrados con wrap.
 * Sticky en top dentro del contenedor, con padding lateral de 20px.
 */
export function Navigation({
  nav,
  locale,
  siteName,
}: {
  nav: readonly NavLink[];
  locale: Locale;
  siteName: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-[20px] top-[60px] bottom-0 z-50">
      <nav
        aria-label="Main"
        className="pointer-events-auto sticky top-0 flex items-start justify-center pt-[10px] tablet:justify-between"
      >
        <Link
          href={path(locale)}
          className="hidden size-[44px] shrink-0 tablet:block"
          aria-label={`${siteName} — home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo-mark.png"
            alt=""
            className="size-full object-cover"
          />
        </Link>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-[8px] tablet:flex-none">
          {nav.map((item) => (
            <li key={item.label}>
              <NavItem
                href={resolveHref(item.route, locale)}
                label={item.label}
                variant={item.variant as NavItemVariant}
              />
            </li>
          ))}
        </ul>

        <div aria-hidden className="hidden size-[44px] shrink-0 tablet:block" />
      </nav>
    </div>
  );
}
