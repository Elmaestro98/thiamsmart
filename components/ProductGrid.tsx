"use client";
import React, { useEffect, useState } from "react";
import ProductCard, { ProductData } from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import NoProductAvailable from "./NoProductAvailable";
import Container from "./Container";
import { Loader2 } from "lucide-react";
import client from "@/sanity/lib/client";
import HomeTabbar from "./HommeTabbar";
import { productType } from "@/app/constants/data";
import Image, { StaticImageData } from "next/image";
import { ads1 } from "@/images/banner";

// Définition d'une union de types discriminée pour les publicités
type Ad =
  | { type: "image"; src: StaticImageData; alt: string }
  | {
      type: "content";
      bg: string;
      tag: string;
      title: string;
      icon: string;
      cta: string;
    };

// Déplacé à l'extérieur pour éviter la recréation à chaque rendu
const ads: Ad[] = [
  {
    type: "image",
    src: ads1, // Correction : retrait des accolades
    alt: "Promo wadial Tabaski",
  },
  {
    type: "content",
    bg: "from-[#74212A] to-[#fb6c08]",
    tag: "Lo am am Eléctroménager",
    title: "Gaaaawlén",
    icon: "🐏",
    cta: "En profiter",
  },
];

const ProductGrid = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  // Utiliser la value pour le filtre, mais garder le title pour l'affichage
  const [selectedTab, setSelectedTab] = useState(productType[0]?.value || "");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentAd = ads[currentAdIndex];

  useEffect(() => {
    const query = `*[_type == "product" && variant == $variant] | order(name asc){
      ...,"categories": categories[]->title
    }`;
    const params = { variant: selectedTab };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.log("Erreur de récupération du produit", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  // Trouver le title correspondant à la value pour l'affichage dans HomeTabbar
  const selectedTabTitle =
    productType.find((t) => t.value === selectedTab)?.title || "";

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      <div className="relative bg-shop_orange/25 rounded-3xl w-full h-32 sm:h-44 md:h-52 lg:h-64 overflow-hidden shadow-sm group/ad">
        {currentAd.type === "image" ? (
          <Image
            src={currentAd.src}
            alt={currentAd.alt}
            fill
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
            className="object-contain object-center transition-transform duration-1000 group-hover/ad:scale-105"
          />
        ) : (
          <div
            className={`flex items-center justify-between h-full px-8 bg-gradient-to-br ${currentAd.bg}`}
          >
            <div>
              <p className="text-xs text-white/70 uppercase tracking-widest mb-1">
                {currentAd.tag}
              </p>
              <p className="text-xl font-medium text-white leading-tight whitespace-pre-line mb-3">
                {currentAd.title}
              </p>
              <button className="text-xs text-white border border-white/40 bg-white/20 px-4 py-1.5 rounded-full">
                {currentAd.cta} →
              </button>
            </div>
            <span className="text-6xl opacity-20">{currentAd.icon}</span>
          </div>
        )}
      </div>
      <HomeTabbar
        selectedTab={selectedTabTitle}
        onTabSelect={(title) => {
          // Trouver la value correspondante au title sélectionné
          const found = productType.find((t) => t.title === title);
          setSelectedTab(found?.value || "");
        }}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-shop_orange">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Chargement des produits...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4">
          <AnimatePresence>
            {products?.map((product) => (
              <motion.div
                key={product?._id}
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTabTitle} />
      )}
    </Container>
  );
};

export default ProductGrid;
