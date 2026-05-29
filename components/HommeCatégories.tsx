import Title from "./Title";
import { Category } from "@/sanity.types";
import { ArrowRight, Grid3X3 } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

type CategoryWithCount = Category & { productCount?: number };

const HomeCategories = ({
  categories,
}: {
  categories: CategoryWithCount[];
}) => {
  return (
    <section className="my-10 md:my-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_orange mb-2">
            Explorer
          </p>
          <Title className="text-2xl md:text-3xl font-bold text-shop_light_brown leading-tight">
            Produits Populaires
          </Title>
        </div>
        <Link
          href="/category/manette"
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-shop_light_brown transition-colors duration-200"
        >
          <span className="hidden sm:inline">Toutes les catégories</span>
          <span className="sm:hidden">Voir tout</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category, index) => (
          <Link
            key={category?._id}
            href={`/category/${category?.slug?.current}`}
            className="group relative bg-white border border-shop_light_brown rounded-xl overflow-hidden hover:border-shop_orange/40 hover:shadow-lg hover:shadow-shop_orange/5 transition-all duration-300"
          >
            {/* Subtle index badge */}
            <span className="absolute top-3 right-3 text-[10px] font-bold text-gray-300 tabular-nums z-10">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="p-5 flex items-center gap-4">
              {/* Image container */}
              {category?.image ? (
                <div className="relative shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 group-hover:border-shop_orange/30 overflow-hidden transition-colors duration-300">
                  <Image
                    src={urlFor(category.image).url()}
                    alt={category?.title ?? "category"}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Grid3X3 size={20} className="text-gray-300" />
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-shop_orange transition-colors duration-200">
                  {category?.title}
                </h3>
                <div className="mt-1.5">
                  {category?.productCount && category.productCount > 0 ? (
                    <span className="inline-flex items-center gap-1 bg-shop_light_green/10 text-shop_dark_green text-xs font-semibold px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-shop_dark_green/60" />
                      {category.productCount} produit
                      {category.productCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-shop_light_brown">
                      Aucun produit
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight
                size={14}
                className="shrink-0 text-gray-300 group-hover:text-shop_orange group-hover:translate-x-0.5 transition-all duration-200"
              />
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-shop_orange/0 via-shop_orange to-shop_orange/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
