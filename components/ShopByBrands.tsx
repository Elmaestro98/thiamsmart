import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Brand } from "@/sanity.types";
import { DoorOpen, Headset, ShieldCheck, Truck } from "lucide-react";

const extraData = [
  {
    title: "Livraison Gratuite",
    description: "Livraison Gratuite partout à Dakar",
    icon: Truck,
  },

  {
    title: "Service Client 24/7",
    description: "Support client amical disponible à tout moment",
    icon: Headset,
  },
  {
    title: "Matériels Garantis",
    description: "Qualité vérifiée par notre équipe experte",
    icon: ShieldCheck,
  },

  {
    title: "Ouverture 7/7",
    description: "Thiamsmart est disponible 24h/24h 7/7",
    icon: DoorOpen,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <div className="mb-10 lg:mb-20">
      {/* Brands Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_orange mb-1">
              Nos Partenaires
            </p>
            <Title className="text-xl md:text-2xl font-bold text-shop_light_brown">
              Achat par Marque
            </Title>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-shop_orange transition-colors duration-200"
          >
            Voir tout
            <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">
              →
            </span>
          </Link>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {brands?.map((brand: Brand) => (
            <Link
              key={brand?._id}
              href={{
                pathname: "/shop",
                query: { brand: brand?.slug?.current },
              }}
              className="group relative bg-gray-50 rounded-xl border border-gray-100 aspect-square flex items-center justify-center overflow-hidden hover:border-shop_orange/30 hover:bg-white hover:shadow-md hover:shadow-shop_orange/5 transition-all duration-300"
            >
              {brand?.image && (
                <Image
                  src={urlFor(brand.image).url()}
                  alt={brand?.title ?? "brand"}
                  width={200}
                  height={200}
                  className="w-3/4 h-3/4 object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Strip */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {extraData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group flex items-center gap-4 px-6 py-5 hover:bg-shop_orange/[0.03] transition-colors duration-200"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-[#74212a] flex items-center justify-center  transition-colors duration-200">
                <Icon
                  size={22}
                  className="text-shop_light_bg"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopByBrands;
