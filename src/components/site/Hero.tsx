import Image from "next/image";
import { Wordmark } from "./Wordmark";

/**
 * Hero section — Figma 0:378
 * Fotografía a sangre con el logotipo anclado abajo, sangrando por los lados.
 * Desktop: alto 800px, padding 20px. Mobile: alto 640px, padding 10px.
 */
export function Hero({
  image,
  alt,
  siteName,
}: {
  image: string;
  alt: string;
  siteName: string;
}) {
  return (
    <header className="relative flex h-[640px] w-full flex-col items-center justify-end overflow-hidden rounded-card tablet:h-[800px]">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />

      <h1 className="sr-only">{siteName}</h1>

      <div className="relative z-10 flex w-full flex-col items-start px-[10px] pb-[10px] tablet:px-[20px] tablet:pb-[20px]">
        <Wordmark />
      </div>
    </header>
  );
}
