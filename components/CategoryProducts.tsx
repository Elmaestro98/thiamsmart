"use client";
import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, LayoutGrid } from "lucide-react";
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
  categories: Category[];
  slug: string;
  products?: ProductData[];
}

const CategoryProducts = ({
  categories,
  slug,
  products: initialProducts,
}: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<ProductData[]>(
    initialProducts || [],
  );
  const [loading, setLoading] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const skipNextFetch = useRef(!!initialProducts);
  const router = useRouter();

  // Synchroniser l'état local si la prop slug change (navigation externe)
  useEffect(() => {
    if (slug && slug !== currentSlug) {
      setCurrentSlug(slug);
      if (initialProducts) {
        setProducts(initialProducts);
        skipNextFetch.current = true;
      }
    }
  }, [slug, currentSlug, initialProducts]);

  const handleCategoryChange = (newSlug: string) => {
    setMobileCategoriesOpen(false);
    if (newSlug === currentSlug) return; // Prevent unnecessary updates
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false }); // Update URL without
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id) && references(*[_type == "store" && slug.current == "keur-massar"]._id)] | order(name asc){
        ...,
        "categories": categories[]->title,
        "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
        "reviewCount": count(*[_type == "review" && references(^._id)])
        }
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    fetchProducts(currentSlug);
  }, [currentSlug]);

  const categoriesContent = (
    <>
      {categories?.map((item) => (
        <Button
          variant="ghost"
          onClick={() => {
            const s = (item?.slug as any)?.current || (item?.slug as any);
            if (s) handleCategoryChange(s);
          }}
          key={item?._id}
          className={`justify-start rounded-none h-12 px-4 font-semibold transition-all capitalize border-b last:border-b-0 ${
            ((item?.slug as any)?.current || item?.slug) === currentSlug
              ? "bg-shop_orange text-black hover:bg-shop_orange hover:text-white"
              : "text-gray-800 hover:bg-gray-50 hover:text-shop_orange"
          }`}
        >
          {/* On gère title ou titre pour être sûr de l'affichage */}
          {item?.title || (item as any)?.titre}
        </Button>
      ))}
    </>
  );

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* Bouton catégories, visible uniquement en mobile */}
      <Sheet open={mobileCategoriesOpen} onOpenChange={setMobileCategoriesOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden flex items-center gap-1.5 border border-shop_dark_green/40 rounded-full px-3 py-1.5 text-sm font-medium text-shop_dark_green hoverEffect hover:bg-shop_dark_green/10">
            <LayoutGrid className="w-4 h-4" />
            Catégories
          </button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Catégories</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
            {categoriesContent}
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar catégories, visible uniquement à partir de md */}
      <div className="hidden md:flex md:flex-col md:min-w-48 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {categoriesContent}
      </div>
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
              {products?.map((product) => (
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
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
