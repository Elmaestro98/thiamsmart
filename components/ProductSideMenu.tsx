"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const existingProduct =
    favoriteProduct?.find((item) => item?._id === product?._id) ?? null;

  const toggleFavorite = async () => {
    if (!product?._id || isLoading) return;

    const wasExisting = existingProduct;
    setIsLoading(true);

    try {
      await addToFavorite(product);
      toast.success(
        wasExisting
          ? "Produit retiré des favoris !"
          : "Produit ajouté aux favoris !",
      );
    } catch (error) {
      toast.error("Une erreur s'est produite !");
      console.error("Erreur lors de la gestion des favoris:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFavorite();
    }
  };

  return (
    <div
      className={cn("absolute top-2 right-2 hover:cursor-pointer", className)}
    >
      <div
        onClick={handleFavorite}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={
          existingProduct ? "Retirer des favoris" : "Ajouter aux favoris"
        }
        className={cn(
          "p-2.5 rounded-full hoverEffect transition-all",
          "hover:bg-shop_orange/80 hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-shop_orange focus:ring-offset-2",
          existingProduct ? "bg-shop_orange text-white" : "bg-lightColor/10",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        <Heart
          size={15}
          fill={existingProduct ? "currentColor" : "none"}
          className={cn("transition-transform", isLoading && "animate-pulse")}
        />
      </div>
    </div>
  );
};

export default ProductSideMenu;
