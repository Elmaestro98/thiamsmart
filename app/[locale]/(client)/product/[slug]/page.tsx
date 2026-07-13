import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import Container from "@/components/Container";
import AddToCartButton from "@/components/AddToCartButton";
import PriceView from "@/components/PriceView";
import ImageView from "@/components/ImageView";
import FavoriteButton from "@/components/FavoriteButton";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductReviews from "@/components/ProductReviews";
import ProductRatingSummary from "@/components/ProductRatingSummary";
import { ProductReviewsProvider } from "@/components/ProductReviewsProvider";
import { type ReviewItem } from "@/lib/reviews";
import { FiShare2 } from "react-icons/fi";
import { Truck, CornerDownLeft } from "lucide-react";
import { RxBorderSplit } from "react-icons/rx";
import { FaRegQuestionCircle } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const BASE_URL = "https://thiamsmart.com";

type Props = { params: Promise<{ slug: string }> };

const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0]`, {
    slug,
  });
};

const getProductReviews = async (productId: string): Promise<ReviewItem[]> => {
  return client.fetch(
    `*[_type == "review" && references($productId)] | order(_createdAt desc){
      _id, _createdAt, customerName, rating, comment
    }`,
    { productId },
    { next: { tags: [`reviews-${productId}`] } },
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Produit non trouvé" };

  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(630).url()
    : undefined;

  const productUrl = `${BASE_URL}/product/${product.slug?.current}`;

  return {
    title: product.name,
    description: `${product.name} disponible sur ThiamSmart. Livraison rapide, prix compétitifs.`,
    alternates: { canonical: productUrl },
    openGraph: {
      title: product.name ?? "",
      url: productUrl,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name ?? "",
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getProductReviews(product._id);

  const isInStock = product.stock != null && product.stock > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? "",
    sku: product._id,
    image: product.images?.[0] ? urlFor(product.images[0]).url() : "",
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug?.current}`,
      priceCurrency: "XOF",
      price: product.price,
      availability: isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "ThiamSmart" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produits",
        item: `${BASE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${BASE_URL}/product/${product.slug?.current}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#fafaf8]">
        <ProductReviewsProvider initialReviews={reviews}>
          <Container className="py-8 px-4 md:px-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Fil d'ariane"
              className="flex items-center gap-2 text-[11px] text-gray-400 mb-10 font-medium tracking-[0.15em] uppercase"
            >
              <Link
                href="/"
                className="hover:text-gray-800 transition-colors duration-200"
              >
                Accueil
              </Link>
              <span className="text-gray-300">›</span>
              <Link
                href="/shop"
                className="hover:text-gray-800 transition-colors duration-200"
              >
                Produits
              </Link>
              <span className="text-gray-300">›</span>
              <span className="text-gray-700">{product.name}</span>
            </nav>

            {/* Main Product Layout */}
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
              {/* Left — Images */}
              <div className="w-full lg:w-[55%]">
                {product.images && (
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                    <ImageView
                      images={product.images}
                      isStock={product.stock}
                    />
                  </div>
                )}
              </div>

              {/* Right — Details */}
              <div className="w-full lg:w-[45%] flex flex-col gap-6">
                {/* Title + Share */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-shop_light_brown leading-tight tracking-tight">
                      {product.name}
                    </h1>
                    <button
                      aria-label="Partager ce produit"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0 mt-1"
                    >
                      <FiShare2 size={18} />
                    </button>
                  </div>

                  {/* Stars */}
                  <ProductRatingSummary />

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {typeof product.description === "string"
                        ? product.description
                        : ""}
                    </p>
                  )}
                </div>

                <div className="h-px bg-gray-100" />

                {/* Price + Stock */}
                <div className="flex items-center justify-around flex-wrap gap-3">
                  <PriceView
                    price={product.price}
                    className="text-xl font-bold text-shop_orange"
                  />
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      isInStock
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-red-50 text-red-600 ring-1 ring-red-200"
                    }`}
                  >
                    {isInStock ? "✓ En stock" : "Rupture de stock"}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <AddToCartButton product={product} />
                  </div>
                  <FavoriteButton showProduct={true} product={product} />
                </div>

                {/* Characteristics */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <ProductCharacteristics product={product} />
                </div>

                {/* Quick Info Pills */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      icon: <RxBorderSplit size={16} />,
                      label: "Choix de Couleur",
                    },
                    { icon: <FaRegQuestionCircle size={15} />, label: "FAQ" },
                    {
                      icon: <TbTruckDelivery size={17} />,
                      label: "Livraison Partout",
                    },
                    { icon: <FiShare2 size={15} />, label: "Partager" },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all duration-200 font-medium shadow-sm"
                    >
                      <span className="text-gray-400">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Delivery + Guarantee */}
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm divide-y divide-gray-100">
                  <div className="flex items-center gap-4 p-4 bg-white">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <Truck size={20} className="text-shop_orange" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Livraison Gratuite
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Entre ton adresse pour voir les options de livraison.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                      <CornerDownLeft size={20} className="text-shop_orange" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Satisfait ou Remboursé
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Nos produits sont garantis.{" "}
                        <span className="underline underline-offset-2 cursor-pointer hover:text-gray-700">
                          Voir les détails
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avis clients */}
            <div className="mt-12 max-w-3xl">
              <h2 className="text-xl font-bold text-shop_light_brown mb-4">
                Avis clients
              </h2>
              <ProductReviews productId={product._id} />
            </div>
          </Container>
        </ProductReviewsProvider>
      </div>
    </>
  );
};

export default ProductPage;
