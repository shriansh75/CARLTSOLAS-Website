import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteUrl";

/** Generates /robots.txt. The site is fully public, so everything is crawlable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
