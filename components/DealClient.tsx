"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import ProductCard, { ProductData } from "@/components/ProductCard";
import { Category, DEAL_PRODUCTS_RESULT } from "@/sanity.types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type DealClientProps = {
  products: DEAL_PRODUCTS_RESULT;
  categories: Category[];
};

type FilterItem = {
  id: string;
  label: string;
  value: string;
};

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────

const EmptyState = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <span className="text-5xl mb-4">😔</span>

      <h3 className="text-lg font-semibold text-stone-700">
        Aucun produit trouvé
      </h3>

      <p className="text-sm text-stone-400 mt-2">
        Aucun bon plan disponible dans cette catégorie.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

const DealClient = ({ products, categories }: DealClientProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

  // ───────────────────────────────────────────────────────────
  // Filters
  // ───────────────────────────────────────────────────────────

  const filters = useMemo<FilterItem[]>(() => {
    return [
      {
        id: "all",
        label: "Tout voir",
        value: "all",
      },

      ...categories.map((category) => ({
        id: category._id,
        label: category.titre || "Sans catégorie",
        value: category._id,
      })),
    ];
  }, [categories]);

  // ───────────────────────────────────────────────────────────
  // Filtered Products
  // ───────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }

    return products.filter((product) =>
      product.categories?.some(
        (category: any) => category?._id === activeFilter,
      ),
    );
  }, [products, activeFilter]);

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-amber-100 py-10">
      <Container>
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-1">
              🔥 Offres exclusives
            </p>

            <h1 className="text-3xl font-bold text-stone-900">
              Bons Plans du mois
            </h1>

            <p className="text-sm text-stone-500 mt-2">
              Stocks limités · Offres valables jusqu&apos;au 31 mai
            </p>
          </div>

          <div className="bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-full animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            PROMO EN COURS
          </div>
        </header>

        {/* Filters */}
        <nav
          aria-label="Filtres catégories"
          className="flex flex-wrap gap-3 mb-8"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-400
                  ${
                    isActive
                      ? "bg-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-white border-stone-200 text-stone-600 hover:border-orange-400 hover:text-orange-500"
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </nav>

        {/* Products */}
        <section aria-label="Produits en promotion">
          {filteredProducts.length === 0 ? (
            <div className="grid grid-cols-1">
              <EmptyState />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-up"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <ProductCard product={product as unknown as ProductData} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer CTA */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              className="px-7 py-3 rounded-full border-2 border-orange-400 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Voir tous les bons plans →
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default DealClient;
