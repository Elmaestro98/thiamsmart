"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { LayoutGrid, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  titre: string;
  slug: string;
  image?: any;
}

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }

        console.log("Catégories reçues de l'API:", data);
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-shop_light_bg text-white px-5 py-3 font-bold text-sm rounded-t-sm">
        <LayoutGrid className="text-shop_light_brown" size={18} />
        <span className="text-shop_light_brown">Catégories...</span>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 bg-shop_light_bg text-white px-5 py-3 font-bold text-sm rounded-t-sm hover:bg-opacity-90 transition-all duration-150 h-full">
        <LayoutGrid className="text-shop_light_brown" size={18} />
        <span className="text-shop_light_brown">Toutes les catégories</span>
        <ChevronDown className="text-shop_light_brown" size={15} />
      </MenuButton>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute left-0 top-full mt-0 w-80 bg-white rounded-b-xl shadow-2xl z-50 focus:outline-none overflow-hidden border border-gray-100 max-h-96 overflow-y-auto">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <MenuItem key={cat._id}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-shop_light_brown hover:bg-shop_light_brown/10 border-b border-gray-50 last:border-0 transition-colors duration-150 group"
                >
                  {/* Image de la catégorie */}
                  <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                    {cat.image ? (
                      <Image
                        src={urlFor(cat.image).width(48).height(48).url()}
                        alt={cat.titre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 text-white text-lg">
                        📦
                      </div>
                    )}
                  </div>
                  {/* Nom de la catégorie */}
                  <span className="font-poppins flex-1 group-hover:font-semibold transition-all">
                    {cat.titre}
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
              </MenuItem>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              Aucune catégorie disponible
            </div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
