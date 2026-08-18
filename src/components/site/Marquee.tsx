/** Marquee — Figma 0:375 · barra de 60px con el claim del sitio */
export function Marquee({ text }: { text: string }) {
  return (
    <div className="flex h-[60px] w-full items-center justify-center overflow-hidden px-[20px]">
      <p className="type-p1-semibold w-full text-center text-paragraph-3">
        {text}
      </p>
    </div>
  );
}
