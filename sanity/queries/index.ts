import { sanityFetch } from "../lib/live";
import { dynamicClient } from "../lib/client";
import {
  BLOG_CATEGORIES,
  BRAND_BY_SLUG_QUERY,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
  STORES_QUERY,
  STORE_BY_SLUG_QUERY,
  SITEMAP_PRODUCTS_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_BRANDS_QUERY,
  SITEMAP_STORES_QUERY,
} from "./query";

const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;
    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });
    return data;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest Blogs:", error);
    return [];
  }
};
const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products:", error);
    return [];
  }
};
const getProductBySlug = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
const getBrand = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: BRAND_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
const getMyOrders = async (userId: string) => {
  try {
    // Client sans cache : l'historique des commandes doit toujours être à
    // jour juste après qu'un client passe commande.
    const orders = await dynamicClient.fetch(MY_ORDERS_QUERY, { userId });
    return orders || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};
const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};
const getStores = async () => {
  try {
    const { data } = await sanityFetch({ query: STORES_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching stores:", error);
    return [];
  }
};

const getStoreBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: STORE_BY_SLUG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.log("Error fetching store by slug:", error);
    return null;
  }
};

const getBrandBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: BRAND_BY_SLUG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.log("Error fetching brand by slug:", error);
    return null;
  }
};

const getSitemapProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: SITEMAP_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching sitemap products:", error);
    return [];
  }
};

const getSitemapCategories = async () => {
  try {
    const { data } = await sanityFetch({ query: SITEMAP_CATEGORIES_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching sitemap categories:", error);
    return [];
  }
};

const getSitemapBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: SITEMAP_BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching sitemap brands:", error);
    return [];
  }
};

const getSitemapStores = async () => {
  try {
    const { data } = await sanityFetch({ query: SITEMAP_STORES_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching sitemap stores:", error);
    return [];
  }
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
  getStores,
  getStoreBySlug,
  getBrandBySlug,
  getSitemapProducts,
  getSitemapCategories,
  getSitemapBrands,
  getSitemapStores,
};
