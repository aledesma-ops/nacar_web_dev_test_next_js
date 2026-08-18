"use client";

import { useState } from "react";

/**
 * Logotipo "Grain Archive" — Figma 0:381 (aspect 1218.57 × 172.13).
 *
 * El SVG original vive en Figma. Si ejecutas `npm run fetch:assets` (o exportas
 * el logo a public/images/brand/grain-archive-logo.svg) se usa el archivo real;
 * si no existe, se cae a un lockup tipográfico en Tilt Warp que ocupa el mismo
 * ancho, para que la maqueta funcione desde el primer `npm run dev`.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`@container aspect-[1218.57/172.13] w-full ${className}`}
      role="img"
      aria-label="Grain Archive"
    >
      {failed ? (
        <span
          className="flex h-full w-full items-center justify-center whitespace-nowrap text-[15.4cqw] leading-[0.85] tracking-[-0.04em] text-headline-1"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden="true"
        >
          Grain Archive
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/brand/grain-archive-logo.svg"
          alt=""
          className="block h-full w-full"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
