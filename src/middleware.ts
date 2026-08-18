import { NextResponse, type NextRequest } from "next/server";
import { matchLocale } from "@/keystatic/i18n";

/**
 * Solo se ocupa de la raíz: `/` negocia idioma con `Accept-Language` y redirige.
 * Todo lo demás ya vive en rutas con prefijo de idioma y se prerenderiza, así
 * que el middleware no se ejecuta y no añade latencia en el 99% de las visitas.
 */
export function middleware(request: NextRequest) {
  const locale = matchLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
