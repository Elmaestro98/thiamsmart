import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio",
          "/api/",
          "/cart",
          "/orders",
          "/wishlist",
          "/success",
        ],
      },
    ],
    sitemap: "https://thiamsmart.com/sitemap.xml",
  };
}
