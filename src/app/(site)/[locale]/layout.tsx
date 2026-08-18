import type { Metadata } from "next";
import { Geist, Instrument_Serif, Tilt_Warp } from "next/font/google";
import { notFound } from "next/navigation";
import "../../globals.css";
import {
  isLocale,
  localeHtmlLang,
  locales,
  type Locale,
} from "@/keystatic/i18n";
import { getSiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-geist",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tilt-warp",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const settings = await getSiteSettings(locale);

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.name,
      template: settings.seo.titleTemplate || `%s · ${settings.name}`,
    },
    description: settings.seo.description,
    icons: { icon: "/images/brand/favicon.svg" },
    openGraph: {
      siteName: settings.name,
      locale: localeHtmlLang[locale],
      type: "website",
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeHtmlLang[locale as Locale]}
      className={`${geist.variable} ${instrumentSerif.variable} ${tiltWarp.variable}`}
    >
      <body className="bg-bg-1">{children}</body>
    </html>
  );
}
