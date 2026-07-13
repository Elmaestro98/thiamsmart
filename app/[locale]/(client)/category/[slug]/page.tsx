import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = "https://thiamsmart.com";

type Props = { params: Promise<{ slug: string }> };

const findCategory = (categories: any[], slug: string) =>
  categories.find(
    (cat: any) => (cat.slug as any)?.current === slug || cat.slug === slug,
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const currentCategory = findCategory(categories, slug);

  if (!currentCategory) return { title: "Catégorie non trouvée" };

  const categoryName = currentCategory.title || currentCategory.titre || slug;
  const categoryUrl = `${BASE_URL}/category/${slug}`;
  const description =
    currentCategory.description ||
    `Découvrez tous nos produits ${categoryName} : livraison rapide et prix compétitifs sur ThiamSmart.`;

  return {
    title: categoryName,
    description,
    alternates: { canonical: categoryUrl },
    openGraph: { title: categoryName, description, url: categoryUrl },
  };
}

const CategoryPage = async ({ params }: Props) => {
  const categories = await getCategories();
  const { slug } = await params;

  // Trouver la catégorie actuelle pour afficher son vrai titre
  const currentCategory = findCategory(categories, slug);
  const categoryName =
    currentCategory?.title || (currentCategory as any)?.titre || slug;

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
        name: categoryName,
        item: `${BASE_URL}/category/${slug}`,
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
        {/* Fil d'ariane */}
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
          <span className="text-shop_ligh_blue">{categoryName}</span>
        </nav>

        <header className="mb-10">
          <Title className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
            {categoryName}
          </Title>
          <div className="h-1.5 w-20 bg-shop_orange mt-4 rounded-full" />
        </header>

        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
