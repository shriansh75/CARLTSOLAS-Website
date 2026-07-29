import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteUrl";

/** Generates /sitemap.xml. Keep in step with the routes in app/. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/marine"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/marine/flag-state-inspections"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/marine/lifeboat-manufacturing"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
