import BrandProducts from "@/components/BrandProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getBrandBySlug, getCategories } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const BASE_URL = "https://thiamsmart.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) return { title: "Marque non trouvée" };

  const brandUrl = `${BASE_URL}/brand/${slug}`;
  const description =
    brand.description ||
    `Découvrez tous les produits de la marque ${brand.title} sur ThiamSmart.`;

  return {
    title: brand.title,
    description,
    alternates: { canonical: brandUrl },
    openGraph: {
      title: brand.title ?? "",
      description,
      url: brandUrl,
      ...(brand.image && { images: [{ url: urlFor(brand.image).url() }] }),
    },
  };
}

const BrandPage = async ({ params }: Props) => {
  const { slug } = await params;
  const [brand, categories] = await Promise.all([
    getBrandBySlug(slug),
    getCategories(),
  ]);

  if (!brand) return notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Boutique",
        item: `${BASE_URL}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.title,
        item: `${BASE_URL}/brand/${slug}`,
      },
    ],
  };

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/" className="hover:text-shop_orange transition-colors">
            Accueil
          </Link>
          <ChevronRight size={12} className="text-gray-300" />
          <Link
            href="/shop"
            className="hover:text-shop_orange transition-colors"
          >
            Boutique
          </Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-shop_ligh_blue">{brand.title}</span>
        </nav>

        <header className="mb-10 flex items-center gap-6">
          {brand.image && (
            <div className="w-16 h-16 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={urlFor(brand.image).url()}
                alt={brand.title ?? "brand"}
                width={64}
                height={64}
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
          )}
          <div>
            <Title className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
              {brand.title}
            </Title>
            <div className="h-1.5 w-20 bg-shop_orange mt-4 rounded-full" />
            {brand.description && (
              <p className="text-gray-600 text-sm mt-3 max-w-xl">
                {brand.description}
              </p>
            )}
          </div>
        </header>

        <BrandProducts
          slug={slug}
          brandName={brand.title}
          categories={categories}
        />
      </Container>
    </div>
  );
};

export default BrandPage;
