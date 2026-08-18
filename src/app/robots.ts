import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/"] }
      : // Los preview deploys llevan contenido en borrador: no deben indexarse.
        { userAgent: "*", disallow: "/" },
    sitemap: absolute("/sitemap.xml"),
  };
}
