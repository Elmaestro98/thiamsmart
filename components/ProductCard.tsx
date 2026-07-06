"use client";

import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import Image from "next/image";
import ProductSideMenu from "./ProductSideMenu";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import PriceView from "./PriceView";
import useStore from "@/store";
import AddToCartButton from "./AddToCartButton";
import { Flame, Package } from "lucide-react";

export type ProductData = Omit<Product, "categories"> & {
  categories?: (string | null)[] | null;
  avgRating?: number | null;
  reviewCount?: number | null;
};

interface Props {
  product: ProductData;
}

const ProductCard = ({ product }: Props) => {
  const cartQuantity = useStore((state) => state.getItemCount(product._id));
  const stockRestant = (product.stock ?? 0) - cartQuantity;
  const isOutOfStock = stockRestant <= 0;
  const isPromotion = product?.status === "promotion";
  const reviewCount = product?.reviewCount ?? 0;
  const avgRating = product?.avgRating ?? 0;

  return (
    <div className="relative text-sm border border-gray-200 rounded-xl group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
        {product?.images && (
          <Link
            href={`/product/${product?.slug?.current}`}
            className="block relative"
          >
            {/* ✅ Hauteur réduite sur mobile, normale sur desktop */}
            <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 w-full">
              <Image
                src={urlFor(product.images[0]).url()}
                alt={product?.name || "Product"}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={`object-contain p-3 sm:p-4 transition-all duration-500 
                  ${!isOutOfStock ? "group-hover:scale-110" : "opacity-40 grayscale"}`}
              />
            </div>

            {/* Hover Overlay */}
            {!isOutOfStock && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </Link>
        )}

        {/* Product Side Menu */}
        {/* ✅ Toujours visible sur mobile (pas besoin de hover) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <ProductSideMenu product={product as unknown as Product} />
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5 sm:gap-2">
          {isPromotion ? (
            <div className="bg-gradient-to-r from-shop_ligh_blue to-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg backdrop-blur-sm border border-white/20 flex items-center gap-1 sm:gap-1.5 animate-pulse">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></span>
              En Promo
            </div>
          ) : (
            <Link
              href={"/deal"}
              className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full border border-orange-200 shadow-md hover:shadow-lg hover:bg-orange-50 transition-all duration-300 group/flame"
            >
              <Flame
                size={15}
                className="text-shop_orange group-hover/flame:animate-bounce sm:w-[18px] sm:h-[18px]"
                fill="#fb6c08"
              />
            </Link>
          )}

          {isOutOfStock && (
            <div className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg flex items-center gap-1 sm:gap-1.5">
              <Package size={12} className="sm:w-[14px] sm:h-[14px]" />
              Rupture
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      {/* ✅ Padding réduit sur mobile */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
        {/* Category */}
        {product?.categories && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-1 w-1 rounded-full bg-shop_ligh_blue flex-shrink-0"></div>
            <p className="uppercase text-[10px] sm:text-xs font-semibold tracking-wider text-shop_orange line-clamp-1">
              {product.categories
                .map((cat) =>
                  typeof cat === "object"
                    ? (cat as any)?.title || (cat as any)?.titre
                    : cat,
                )
                .join(" • ")}
            </p>
          </div>
        )}

        {/* Product Name */}
        <Link
          href={`/product/${product?.slug?.current}`}
          className="group/title"
        >
          {/* ✅ Taille de police adaptée mobile */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug text-sm sm:text-base group-hover/title:text-shop_ligh_blue transition-colors duration-200">
            {product?.name}
          </h3>
        </Link>

        {/* Rating — masqué sur très petit écran pour gagner de la place */}
        {reviewCount > 0 && (
          <div className="hidden xs:flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${
                    index < Math.round(avgRating)
                      ? "text-amber-400 drop-shadow-sm"
                      : "text-gray-300"
                  }`}
                  fill={index < Math.round(avgRating) ? "#fbbf24" : "#d1d5db"}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs font-medium text-gray-900">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400">•</span>
              <span className="text-[10px] sm:text-xs text-gray-500">
                {reviewCount} avis
              </span>
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-gray-50 border border-gray-100">
          <div
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
              isOutOfStock ? "bg-red-500" : "bg-emerald-500 animate-pulse"
            }`}
          ></div>
          <p className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">
            {isOutOfStock ? "Rupture de stock" : "En stock"}
          </p>
          {!isOutOfStock && (
            <span className="ml-auto text-[10px] sm:text-xs font-semibold text-emerald-600 flex-shrink-0">
              {stockRestant} unités
            </span>
          )}
        </div>

        {/* Price */}
        <div className="pt-1 sm:pt-2">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-sm sm:text-base"
          />
        </div>

        {/* Add to Cart Button — poussé vers le bas grâce au flex-1 du parent */}
        <div className="pt-1 sm:pt-2 mt-auto">
          <AddToCartButton
            product={product as unknown as Product}
            className="w-full rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 text-sm py-2 sm:py-2.5"
          />
        </div>
      </div>

      {/* Decorative bottom bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-shop_ligh_blue via-shop_light_green to-shop_orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
};

export default ProductCard;
