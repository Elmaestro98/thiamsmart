import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) {
  ...,
  "productCount": count(*[_type == "product" && references(^._id)])
}`);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`,
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'promotion'] | order(name asc){
    ...,"categories": categories[]->title
  }`,
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`,
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
  }`);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);
const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `,
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`,
);

//Top produit

const TOP_PRODUCTS_QUERY = `*[_type == "product"][0...5]{
  _id,
  name,
  "image": images[0],
  "imageUrl": images[0].asset->url,
  "imageDimensions": images[0].asset->metadata.dimensions
}`;

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

// 🆕 Requête pour récupérer TOUTES les catégories avec image
const CATEGORIES_QUERY =
  defineQuery(`*[_type == "category"] | order(titre asc) {
  _id,
  titre,
  description,
  "slug": slug.current,
  image,
  range,
  "productCount": count(*[_type == "product" && references(^._id)])
}`);

// 🆕 Requête pour récupérer les produits d'une catégorie spécifique
const PRODUCTS_BY_CATEGORY_QUERY =
  defineQuery(`*[_type == "product" && references($categoryId)] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  images,
  description,
  price,
  discount,
  stock,
  brand->{
    title
  }
}`);

// 🆕 Requête pour récupérer UN produit avec toutes ses informations
const PRODUCT_FULL_QUERY =
  defineQuery(`*[_type == "product" && _id == $productId][0] {
  ...,
  brand->{
    title
  },
  categories[]->{
    titre,
    "slug": slug.current
  }
}`);

export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  CATEGORIES_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCT_FULL_QUERY,
  TOP_PRODUCTS_QUERY,
};
