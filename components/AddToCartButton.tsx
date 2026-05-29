"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 20)}${product?.name && product.name.length > 20 ? "..." : ""} ajouté avec succès !`,
      );
    } else {
      toast.error("Vous ne pouvez pas ajouter plus que le stock disponible");
    }
  };

  return (
    <div className="w-full">
      {itemCount ? (
        <div className="w-full space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Quantité</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-900">
              Sous-total
            </span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
              className="text-base font-bold text-shop_dark_green"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full h-12 bg-shop_light_brown text-white font-semibold tracking-wide",
            "shadow-md hover:shadow-lg transition-all duration-200",
            "border border-shop_light_bg hover:bg-shop_light_brown/90",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md",
            "flex items-center justify-center gap-2",
            className,
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isOutOfStock ? "Rupture de stock" : "J'achète"}</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
