import BrandProducts from "@/components/BrandProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getBrandBySlug, getCategories } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

const BrandPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [brand, categories] = await Promise.all([
    getBrandBySlug(slug),
    getCategories(),
  ]);

  if (!brand) return notFound();

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
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
