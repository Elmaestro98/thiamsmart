import React from "react";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;
  const isMaxStock = itemCount >= (product?.stock as number);

  const handleRemoveProduct = () => {
    if (itemCount === 0) return;

    removeItem(product?._id);

    if (itemCount === 1) {
      toast.success("Produit retiré du panier");
    } else {
      toast.success("Quantité diminuée");
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success("Quantité augmentée");
    } else {
      toast.error(
        `Stock maximum atteint (${product?.stock} disponible${(product?.stock as number) > 1 ? "s" : ""})`,
      );
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className={cn(
          "w-8 h-8 rounded-md border border-gray-300",
          "hover:bg-shop_dark_green/10 hover:border-shop_dark_green",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-all duration-200",
          "flex items-center justify-center",
        )}
        aria-label="Diminuer la quantité"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="flex items-center justify-center min-w-[40px]">
        <span className="font-semibold text-base text-gray-900">
          {itemCount}
        </span>
      </div>

      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock || isMaxStock}
        className={cn(
          "w-8 h-8 rounded-md border border-gray-300",
          "hover:bg-shop_dark_green/10 hover:border-shop_dark_green",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "transition-all duration-200",
          "flex items-center justify-center",
        )}
        aria-label="Augmenter la quantité"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantityButtons;
