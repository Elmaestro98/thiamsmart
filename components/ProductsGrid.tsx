"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ShoppingCart, Heart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: any[];
  description?: string;
  price: number;
  discount: number;
  stock: number;
  brand?: {
    title: string;
  };
}

interface Category {
  _id: string;
  titre: string;
}

interface ProductsGridProps {
  category: Category;
  products: Product[];
  loading: boolean;
  onBack: () => void;
}

export default function ProductsGrid({
  category,
  products,
  loading,
  onBack,
}: ProductsGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header avec bouton retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-md"
      >
        <ChevronLeft size={20} />
        <span className="font-semibold">Retour aux catégories</span>
      </button>

      {/* Titre de la catégorie */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {category.titre}
        </h1>
        <p className="text-gray-600">{products.length} produits disponibles</p>
      </div>

      {/* Affichage des produits */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-xl text-gray-600 mb-2">Aucun produit trouvé</p>
          <p className="text-gray-500">
            Cette catégorie n'a pas encore de produits
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => {
                setSelectedProduct(product);
                setCurrentImageIndex(0);
              }}
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              {/* Container image avec badges */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-300 to-gray-400">
                    <span className="text-gray-600 text-4xl">📦</span>
                  </div>
                )}

                {/* Badge promo */}
                {product.discount > product.price && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -
                    {Math.round(
                      ((product.discount - product.price) / product.discount) *
                        100,
                    )}
                    %
                  </div>
                )}

                {/* Badge stock */}
                <div className="absolute top-3 left-3">
                  {product.stock > 0 ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      En stock ({product.stock})
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Rupture de stock
                    </span>
                  )}
                </div>

                {/* Boutons d'action au survol */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Nombre de photos */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {product.images.length} photos
                  </div>
                )}
              </div>

              {/* Infos produit */}
              <div className="p-4">
                {product.brand && (
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    {product.brand.title}
                  </p>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Prix */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  {product.discount > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.discount.toLocaleString()} FCFA
                    </span>
                  )}
                </div>

                {/* Bouton ajouter au panier */}
                <button
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour voir les détails du produit avec carousel */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

interface ProductModalProps {
  product: Product;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  onClose: () => void;
}

function ProductModal({
  product,
  currentImageIndex,
  onImageChange,
  onClose,
}: ProductModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Carousel d'images */}
          <div>
            <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={urlFor(product.images[currentImageIndex]).url()}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-600 text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onImageChange(index)}
                    className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      currentImageIndex === index
                        ? "ring-2 ring-blue-600"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={urlFor(image).url()}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos du produit */}
          <div className="flex flex-col justify-between">
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase font-semibold">
                {product.brand.title}
              </p>
            )}

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            {product.description && (
              <p className="text-gray-600 mb-6">{product.description}</p>
            )}

            {/* Prix */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {product.price.toLocaleString()} FCFA
                </span>
                {product.discount > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.discount.toLocaleString()} FCFA
                  </span>
                )}
              </div>
              {product.discount > product.price && (
                <p className="text-green-600 font-semibold">
                  Économisez{" "}
                  {(product.discount - product.price).toLocaleString()} FCFA
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p
                className={`text-lg font-semibold ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} en stock`
                  : "Rupture de stock"}
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-4">
              <button
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
              </button>

              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Fermer le modal */}
            <button
              onClick={onClose}
              className="mt-6 text-gray-500 hover:text-gray-700 font-semibold"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
