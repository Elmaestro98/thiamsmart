"use client";
import { BRANDS_QUERY_RESULT, Category } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams, useRouter } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { dynamicClient } from "@/sanity/lib/client";
import { Loader2, SlidersHorizontal } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard, { ProductData } from "./ProductCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface Props {
  categories: (Category & { productCount: number })[];
  brands: BRANDS_QUERY_RESULT;
}

interface ShopContentProps extends Props {
  queryParam: string | null;
}

// ─── Composant interne ────────────────────────────────────────────────────────
// Reçoit queryParam en "key" depuis Shop : quand la recherche change, React
// démonte/remonte ce composant → le state local est réinitialisé sans useEffect.
const ShopContent = ({ categories, brands, queryParam }: ShopContentProps) => {
  const router = useRouter();

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Unique useEffect : fetch produits quand un filtre change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let minPrice = 0;
        let maxPrice = 10_000_000;

        if (selectedPrice) {
          const [min, max] = selectedPrice.split("-").map(Number);
          minPrice = min;
          maxPrice = max;
        }

        const query = `
          *[_type == 'product'
            && references(*[_type == "store" && slug.current == "keur-massar"]._id)
            && ($selectedCategory == null || $selectedCategory in categories[]->slug.current)
            && ($selectedBrand == null || brand->slug.current == $selectedBrand)
            && price >= $minPrice && price <= $maxPrice
            && ($queryParam == null || name match $queryParam + "*")
          ]
          | order(name asc) {
            ...,
            "categories": categories[]->title,
            "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
            "reviewCount": count(*[_type == "review" && references(^._id)])
          }
        `;

        const data: ProductData[] = await dynamicClient.fetch(query, {
          minPrice,
          maxPrice,
          selectedCategory,
          selectedBrand,
          queryParam,
        });

        setProducts(data);
      } catch (error) {
        console.error("Erreur de récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice, queryParam]);

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedBrand !== null ||
    selectedPrice !== null ||
    queryParam !== null;

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
    if (queryParam) {
      router.push("/shop");
    }
  };

  const filtersContent = (
    <>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BrandList
        brands={brands}
        setSelectedBrand={setSelectedBrand}
        selectedBrand={selectedBrand}
      />
      <PriceList
        setSelectedPrice={setSelectedPrice}
        selectedPrice={selectedPrice}
      />
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-10 mb-5">
        <div className="flex items-center justify-between">
          <Title className="text-lg text-shop_orange uppercase tracking-wide">
            {queryParam
              ? `Résultats pour "${queryParam}"`
              : "Faites votre choix !"}
          </Title>
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Réinitialiser les filtres
              </button>
            )}
            {/* Bouton filtres, visible uniquement en mobile */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden flex items-center gap-1.5 border border-shop_dark_green/40 rounded-full px-3 py-1.5 text-sm font-medium text-shop_dark_green hoverEffect hover:bg-shop_dark_green/10">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {filtersContent}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
        {/* Sidebar filtres, visible uniquement à partir de md */}
        <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
          {filtersContent}
        </div>

        {/* Liste des produits */}
        <div className="flex-1 pt-5">
          <div className="md:h-[calc(100vh-160px)] md:overflow-y-auto md:pr-2 scrollbar-hide">
            {loading ? (
              <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                <p className="font-semibold tracking-wide text-base">
                  Chargement . . .
                </p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <NoProductAvailable className="bg-white mt-0" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Composant parent ─────────────────────────────────────────────────────────
const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get("q") ?? null;

  if (
    !categories ||
    !brands ||
    categories.length === 0 ||
    brands.length === 0
  ) {
    return (
      <div className="border-t">
        <Container className="mt-5">
          <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
            <p className="font-semibold tracking-wide text-base text-red-500">
              Erreur : Impossible de charger les données de filtre. Veuillez
              réessayer plus tard.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="border-t">
      <Container className="mt-5">
        {/*
          key={queryParam} : quand la recherche change, React démonte et remonte
          ShopContent → le state local (filtres) est réinitialisé automatiquement,
          sans aucun useEffect avec setState → zéro cascade de renders.
        */}
        <ShopContent
          key={queryParam ?? "default"}
          categories={categories}
          brands={brands}
          queryParam={queryParam}
        />
      </Container>
    </div>
  );
};

export default Shop;
