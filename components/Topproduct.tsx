import Container from "./Container";
import Image from "next/image";
import Title from "./Title";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import client from "@/sanity/lib/client";
import { TOP_PRODUCTS_QUERY } from "@/sanity/queries/query";

type Product = {
  _id: string;
  name: string;
  slug?: string;
  imageUrl: string;
  image?: {
    asset?: {
      url: string;
      _ref?: string;
    };
    alt?: string;
  };
  imageDimensions?: {
    width: number;
    height: number;
  };
};

export default async function Topproduct() {
  const products: Product[] = await client.fetch(TOP_PRODUCTS_QUERY);

  if (!products?.length) return null;

  return (
    <section className="w-full py-12 md:py-16">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_orange mb-2">
              Sélection du moment
            </p>
            <Title className="text-2xl md:text-3xl font-bold text-shop_light_brown leading-tight">
              Top Produits
            </Title>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-shop_light_brown transition-colors duration-200 shrink-0"
          >
            <span className="hidden sm:inline">Tous les produits</span>
            <span className="sm:hidden">Voir tout</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6">
          {products.map((product, index) => (
            <Link
              key={product._id}
              href={product.slug ? `/product/${product.slug}` : "/shop"}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-linear-to-br from-gray-50 to-gray-100 relative ring-0 group-hover:ring-4 group-hover:ring-shop_light_brown/15 group-hover:border-shop_light_brown/40 group-hover:shadow-lg transition-all duration-300">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={112}
                      height={112}
                      priority={index < 3}
                      quality={85}
                      className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-300">
                      <ImageOff size={28} />
                    </div>
                  )}
                </div>
                <span className="absolute -top-1 -left-1 flex items-center justify-center w-6 h-6 rounded-full bg-shop_light_brown text-white text-xs font-bold shadow-md">
                  {index + 1}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-shop_light_brown transition-colors duration-200 max-w-25 sm:max-w-30 line-clamp-2">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
