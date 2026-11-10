import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/utils";

// Halaman pribadi atau transaksional tidak perlu dirayapi.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/akun", "/donasi/", "/campaign/*/donasi", "/auth/", "/api/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
