"use client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const { items } = useStore();
  const itemCount = items?.length || 0;

  return (
    <Link
      href="/cart"
      className="group relative inline-flex items-center"
      aria-label={`Panier - ${itemCount} article${itemCount > 1 ? "s" : ""}`}
    >
      <ShoppingBag
        className="w-5 h-5 transition-colors duration-200 group-hover:text-shop_light_green"
        aria-hidden="true"
      />
      {itemCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-shop_orange text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center shadow-sm"
          aria-hidden="true"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
