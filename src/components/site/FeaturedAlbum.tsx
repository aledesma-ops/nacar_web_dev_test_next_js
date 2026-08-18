import Image from "next/image";
import Link from "next/link";
import { PlayIcon } from "@/components/ui/PlayIcon";

export type FeaturedAlbumData = {
  heading: string;
  cover: string | null;
  coverAlt: string;
  title: string;
  ctaLabel: string;
  ctaHref: string | null;
};

/**
 * Featured album section — Figma 0:400
 * Fondo #141414 + textura en mix-blend-screen al 60%.
 * Título absoluto arriba a la izquierda (Header 2, 160px).
 * Desktop: pt 290 / pb 60, imagen con padding lateral de 200px y máx. 1000px.
 * Mobile:  pt 155 / pb 40, padding lateral de 40px.
 */
export function FeaturedAlbum({ data }: { data: FeaturedAlbumData }) {
  const featuredAlbum = data;
  if (!featuredAlbum.cover) return null;
  return (
    <section className="relative w-full overflow-hidden rounded-card bg-[#141414] px-[10px] pt-[155px] pb-[40px] tablet:pt-[290px] tablet:pb-[60px]">
      <Image
        src="/images/brand/featured-album-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-60 mix-blend-screen"
      />

      <h2 className="type-h2 absolute top-[60px] left-[10px] z-10 w-[335px] max-w-[360px] text-headline-1 tablet:w-[800px] tablet:max-w-[1000px]">
        {featuredAlbum.heading}
      </h2>

      <div className="relative z-10 flex w-full flex-col items-center gap-[32px] px-[40px] tablet:px-[200px]">
        <div className="relative aspect-square w-full max-h-[1000px] max-w-[1000px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25),0px_4px_80px_0px_rgba(0,0,0,0.5)]">
          <Image
            src={featuredAlbum.cover}
            alt={featuredAlbum.coverAlt}
            fill
            sizes="(min-width: 1280px) 880px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full max-w-[640px] flex-col items-center gap-[8px]">
          <p className="type-p1-semibold w-full text-center text-headline-1">
            {featuredAlbum.title}
          </p>
          <Link
            href={featuredAlbum.ctaHref ?? "#"}
            className="group flex items-center gap-[6px] text-headline-1 transition-opacity duration-200 hover:opacity-70"
          >
            <PlayIcon className="shrink-0" />
            <span className="type-p1-semibold whitespace-nowrap">
              {featuredAlbum.ctaLabel}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
