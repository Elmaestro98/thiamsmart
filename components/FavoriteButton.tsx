"use client";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  showProduct?: boolean;
  product?: Product | null;
  className?: string;
}

const FavoriteButton = ({
  showProduct = false,
  product,
  className,
  ...props
}: FavoriteButtonProps &
  React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!product?._id) {
      setExistingProduct(null);
      return;
    }

    const availableItem = favoriteProduct.find(
      (item) => item?._id === product._id,
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof props.onClick === "function") {
      (props.onClick as React.MouseEventHandler<HTMLButtonElement>)(e);
    }

    if (!product?._id || isLoading) return;

    setIsLoading(true);

    try {
      await addToFavorite(product);
      toast.success(
        existingProduct
          ? "Produit retiré des favoris !"
          : "Produit ajouté aux favoris !",
      );
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
      console.error("Erreur de favori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mode compteur (affichage du nombre de favoris)
  if (!showProduct) {
    return (
      <Link
        href="/wishlist"
        className={cn(
          "relative flex items-center justify-center p-2 rounded-full hover:bg-shop_light_brown/20 transition-colors duration-200",
          className,
        )}
        aria-label={`Voir les favoris (${favoriteProduct?.length || 0} articles)`}
        {...(props as any)}
      >
        <Heart className="w-6 h-6 text-white" />
        {favoriteProduct?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-shop_ligh_blue text-shop_orange text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {favoriteProduct.length}
          </span>
        )}
      </Link>
    );
  }

  // Mode bouton produit
  return (
    <button
      {...(props as any)}
      onClick={handleFavorite}
      disabled={isLoading || !product?._id}
      className={cn(
        "p-2 rounded-full hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group",
        className,
      )}
      aria-label={
        existingProduct ? "Retirer des favoris" : "Ajouter aux favoris"
      }
      type="button"
    >
      {existingProduct ? (
        <Heart
          className="w-5 h-5 text-red-500 fill-red-500 transition-transform group-hover:scale-110"
          aria-hidden="true"
        />
      ) : (
        <Heart
          className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default FavoriteButton;
