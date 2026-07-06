"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductsGrid from "./ProductsGrid";
import { urlFor } from "@/sanity/lib/image";

interface Category {
  _id: string;
  titre: string;
  description?: string;
  slug: string;
  image?: any;
  range?: number;
  productCount: number;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ ÉTAPE 1: Charger les catégories au montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Catégories chargées:", data);
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ✅ ÉTAPE 2: Charger les produits quand une catégorie est sélectionnée
  const handleCategoryClick = async (category: Category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);

      const response = await fetch(
        `/api/products-by-category?categoryId=${encodeURIComponent(
          category._id,
        )}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const productsData = await response.json();
      console.log(`Produits de ${category.titre}:`, productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Grille des catégories */}
      {!selectedCategory ? (
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Catégories</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white"
                >
                  {/* Image de la catégorie */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    {category.image ? (
                      <Image
                        src={urlFor(category.image).url()}
                        alt={category.titre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 text-4xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu de la catégorie */}
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {category.titre}
                    </h3>

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Nombre de produits */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {category.productCount} produits
                      </span>

                      {category.range && (
                        <span className="text-sm font-semibold text-green-600">
                          À partir de {category.range} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Afficher les produits de la catégorie sélectionnée
        <ProductsGrid
          category={selectedCategory}
          products={products}
          loading={loading}
          onBack={() => {
            setSelectedCategory(null);
            setProducts([]);
          }}
        />
      )}
    </div>
  );
}
