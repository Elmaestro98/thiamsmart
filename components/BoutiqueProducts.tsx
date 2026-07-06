"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Category } from "@/sanity.types";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard, { ProductData } from "./ProductCard";

interface Props {
  slug: string;
  storeName?: string;
  categories?: Category[];
}

const BoutiqueProducts = ({ slug, storeName, categories = [] }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryFilter = selectedCategory
          ? `&& references(*[_type == "category" && slug.current == $categorySlug]._id)`
          : "";
        const query = `
          *[_type == 'product' && references(*[_type == "store" && slug.current == $storeSlug]._id) ${categoryFilter}] | order(name asc){
          ...,
          "categories": categories[]->title,
          "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
          "reviewCount": count(*[_type == "review" && references(^._id)])
          }
        `;
        const params: Record<string, string> = { storeSlug: slug };
        if (selectedCategory) params.categorySlug = selectedCategory;

        const data = await client.fetch(query, params);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products by store:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, selectedCategory]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {categories.length > 0 && (
        <div className="flex flex-col md:min-w-48 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className={`justify-start rounded-none h-12 px-4 font-semibold transition-all capitalize border-b last:border-b-0 ${
              selectedCategory === null
                ? "bg-shop_orange text-black hover:bg-shop_orange hover:text-white"
                : "text-gray-800 hover:bg-gray-50 hover:text-shop_orange"
            }`}
          >
            Toutes les catégories
          </Button>
          {categories.map((item: any) => {
            const catSlug = item?.slug?.current || item?.slug;
            return (
              <Button
                variant="ghost"
                onClick={() => catSlug && setSelectedCategory(catSlug)}
                key={item?._id}
                className={`justify-start rounded-none h-12 px-4 font-semibold transition-all capitalize border-b last:border-b-0 ${
                  selectedCategory === catSlug
                    ? "bg-shop_orange text-black hover:bg-shop_orange hover:text-white"
                    : "text-gray-800 hover:bg-gray-50 hover:text-shop_orange"
                }`}
              >
                {item?.titre || item?.title}
              </Button>
            );
          })}
        </div>
      )}

      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-shop_orange">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chargement des produits...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={storeName ?? slug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default BoutiqueProducts;
