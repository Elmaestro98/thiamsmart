import type { MetadataRoute } from "next";
import {
  getSitemapBrands,
  getSitemapCategories,
  getSitemapProducts,
  getSitemapStores,
} from "@/sanity/queries";

const BASE_URL = "https://thiamsmart.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, brands, stores] = await Promise.all([
    getSitemapProducts(),
    getSitemapCategories(),
    getSitemapBrands(),
    getSitemapStores(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/boutiques`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/deal`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map(
    (product: { slug: string; _updatedAt: string }) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product._updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const categoryRoutes: MetadataRoute.Sitemap = categories.map(
    (category: { slug: string; _updatedAt: string }) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: category._updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const brandRoutes: MetadataRoute.Sitemap = brands.map(
    (brand: { slug: string; _updatedAt: string }) => ({
      url: `${BASE_URL}/brand/${brand.slug}`,
      lastModified: brand._updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const storeRoutes: MetadataRoute.Sitemap = stores.map(
    (store: { slug: string; _updatedAt: string }) => ({
      url: `${BASE_URL}/boutique/${store.slug}`,
      lastModified: store._updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...storeRoutes,
  ];
}
