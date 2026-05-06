"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  Loader2,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import PriceFormatter from "./PriceFormatter";

const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT = 5;

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Charger l'historique depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const saveRecentSearch = useCallback(
    (term: string) => {
      try {
        const updated = [
          term,
          ...recentSearches.filter((s) => s !== term),
        ].slice(0, MAX_RECENT);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
    },
    [recentSearches],
  );

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  }, []);

  // Raccourci clavier Ctrl+K / ⌘+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Focus auto sur l'input à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Fetch suggestions avec debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const data = await client.fetch(
          `*[_type == "product" && name match $searchQuery + "*"] | order(name asc) [0...5] {
            _id, name, slug, price, images,
            "category": category->name
          }`,
          { searchQuery: query.trim() },
        );
        setSuggestions(data);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    if (term) {
      saveRecentSearch(term);
      router.push(`/shop?q=${encodeURIComponent(term)}`);
      close();
    }
  };

  const handleSuggestionClick = () => {
    if (query.trim()) saveRecentSearch(query.trim());
    close();
  };

  const handleRecentClick = (term: string) => {
    saveRecentSearch(term);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
    close();
  };

  const showRecent = !query && recentSearches.length > 0;
  const showSuggestions = !!query;

  return (
    <>
      {/* Bouton déclencheur avec raccourci affiché */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir la recherche"
        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 w-full max-w-xs"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm hidden sm:block flex-1 text-left">
          Rechercher...
        </span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Overlay + Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
          }}
          onClick={close}
        >
          <div
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            style={{
              animation: "searchSlideIn 0.2s cubic-bezier(0.16,1,0.3,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Champ de recherche */}
            <form
              onSubmit={handleSearch}
              className="flex items-center border-b border-gray-100 px-4"
            >
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Que cherchez-vous ?"
                className="flex-1 h-14 px-4 text-base text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Effacer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-lg bg-shop_light_brown text-white text-sm font-medium hover:bg-shop_orange transition-colors"
              >
                Rechercher
              </button>
            </form>

            {/* Contenu */}
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              {/* Recherches récentes */}
              {showRecent && (
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Recherches récentes
                  </p>
                  <div className="flex flex-col gap-1">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                        onClick={() => handleRecentClick(term)}
                      >
                        <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-700">
                          {term}
                        </span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all"
                          aria-label={`Supprimer "${term}"`}
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions && (
                <div className="p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-shop_orange" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Produits
                      </p>
                      <div className="flex flex-col gap-1">
                        {suggestions.map((product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug?.current}`}
                            onClick={handleSuggestionClick}
                            className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            {/* Image */}
                            <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                              {product.images?.[0] && (
                                <Image
                                  src={urlFor(product.images[0])
                                    .width(96)
                                    .url()}
                                  alt={product.name ?? "Produit"}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>

                            {/* Infos */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-shop_orange transition-colors">
                                {product.name}
                              </p>
                              {(product as any).category && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {(product as any).category}
                                </p>
                              )}
                              <PriceFormatter
                                amount={product.price}
                                className="text-xs font-bold text-shop_orange mt-0.5"
                              />
                            </div>

                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-shop_orange transition-colors flex-shrink-0" />
                          </Link>
                        ))}
                      </div>

                      {/* Lien "voir tous les résultats" */}
                      <Link
                        href={`/shop?q=${encodeURIComponent(query.trim())}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 hover:text-shop_orange hover:border-shop_orange transition-colors"
                      >
                        Voir tous les résultats pour &ldquo;{query}&rdquo;
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm">
                        Aucun produit trouvé pour &ldquo;
                        <span className="font-medium text-gray-600">
                          {query}
                        </span>
                        &rdquo;
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        Essayez un autre terme
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* État vide (pas de query, pas d'historique) */}
              {!showRecent && !showSuggestions && (
                <div className="flex items-center justify-center py-12 text-gray-300 text-sm">
                  Commencez à taper pour rechercher…
                </div>
              )}
            </div>

            {/* Footer avec raccourci */}
            <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-end gap-4 text-xs text-gray-400">
              <span>
                <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                  ↵
                </kbd>{" "}
                Rechercher
              </span>
              <span>
                <kbd className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                  Esc
                </kbd>{" "}
                Fermer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes searchSlideIn {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default SearchBar;
