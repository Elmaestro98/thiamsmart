"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, ShoppingBag } from "lucide-react";
import Title from "./Title";
import Pagination from "./Pagination";
import type { SanityStore } from "./Map";

const STORES_PER_PAGE = 6;

interface Props {
  stores?: SanityStore[];
}

const HomeBoutiques = ({ stores = [] }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!stores.length) return null;

  const totalPages = Math.ceil(stores.length / STORES_PER_PAGE);
  const paginatedStores = stores.slice(
    (currentPage - 1) * STORES_PER_PAGE,
    currentPage * STORES_PER_PAGE,
  );

  return (
    <div className="mt-10 mb-10 lg:mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shop_orange mb-1">
            Où nous trouver ?
          </p>
          <Title className="text-xl md:text-2xl font-bold text-shop_light_brown">
            Nos boutiques
          </Title>
        </div>
        <Link
          href="/boutiques"
          className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-shop_orange transition-colors duration-200"
        >
          Voir tout
          <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">
            →
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedStores.map((store) => (
          <div
            key={store._id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              {store.nom}
            </h3>

            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4 text-shop_orange mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-tight">{store.adresse}</p>
            </div>

            {store.telephone && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Phone className="w-4 h-4 text-shop_orange flex-shrink-0" />
                <a
                  href={`tel:${store.telephone}`}
                  className="text-sm hover:underline"
                >
                  {store.telephone}
                </a>
              </div>
            )}

            {store.slug && (
              <Link
                href={`/boutique/${store.slug}`}
                className="mt-auto flex items-center justify-center gap-2 bg-shop_orange text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors no-underline"
              >
                <ShoppingBag className="w-4 h-4" />
                Voir les produits
              </Link>
            )}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomeBoutiques;
