import Image from "next/image";
import { ButtonSmall } from "@/components/ui/Buttons";

export type SubscribeData = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Perforaciones del "billete" — Figma I:0:698-700 (desktop) / I:0:730-732 (mobile) */
function Holes() {
  return (
    <div
      aria-hidden
      className="flex h-full w-full items-start justify-between px-[20px] py-[16px] tablet:flex-col tablet:items-start tablet:justify-between tablet:py-[50px]"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block size-[20px] shrink-0 rounded-full bg-bg-1 tablet:size-[24px]"
        />
      ))}
    </div>
  );
}

/**
 * Subscribe section — Figma 0:426 · contenedor 0:694
 * Fondo de sección: fotografía a sangre.
 * Contenedor: "ticket" naranja (#FF5700) con laterales perforados y línea discontinua.
 *   Desktop (0:695): fila de 464px de alto, laterales de 64px a izquierda y derecha.
 *   Mobile  (0:727): columna, tiras perforadas arriba y abajo.
 */
export function Subscribe({ data }: { data: SubscribeData }) {
  const subscribe = data;
  return (
    <aside className="relative flex w-full flex-col items-center justify-end px-[40px] pt-[180px] pb-[40px] tablet:pb-[80px]">
      <Image
        src="/images/brand/subscribe-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
      />

      <div className="grain relative z-10 flex w-full max-w-[1400px] flex-col items-start gap-[64px] bg-bg-5 [--grain-blend:multiply] [--grain-opacity:0.16] tablet:h-[464px] tablet:flex-row tablet:items-center tablet:gap-[40px]">
        {/* Paper graphics 1 */}
        <div className="flex h-[52px] w-full items-center border-b-[1.5px] border-dashed border-bg-1 tablet:h-full tablet:w-[64px] tablet:border-b-0 tablet:border-r-[1.5px]">
          <Holes />
        </div>

        {/* Content */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-[32px] px-[40px] tablet:px-0">
          <div className="flex w-full flex-col items-center gap-[16px] text-center text-paragraph-2">
            <h2 className="type-h4 w-full">{subscribe.heading}</h2>
            <p className="type-p1 w-full">{subscribe.body}</p>
          </div>
          <ButtonSmall href={subscribe.ctaHref} label={subscribe.ctaLabel} />
        </div>

        {/* Paper graphics 2 */}
        <div className="flex h-[52px] w-full items-center border-t-[1.5px] border-dashed border-bg-1 tablet:h-full tablet:w-[64px] tablet:border-t-0 tablet:border-l-[1.5px]">
          <Holes />
        </div>
      </div>
    </aside>
  );
}
