import BoutiqueProducts from "@/components/BoutiqueProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories, getStoreBySlug } from "@/sanity/queries";
import Link from "next/link";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

const BoutiquePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [store, categories] = await Promise.all([
    getStoreBySlug(slug),
    getCategories(),
  ]);

  if (!store) return notFound();

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
      <Container>
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/" className="hover:text-shop_orange transition-colors">
            Accueil
          </Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-shop_ligh_blue">{store.nom}</span>
        </nav>

        <header className="mb-10">
          <Title className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 capitalize tracking-tight">
            {store.nom}
          </Title>
          <div className="h-1.5 w-20 bg-shop_orange mt-4 rounded-full mb-4" />
          <div className="flex flex-col gap-1 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-shop_orange" />
              {store.adresse}
            </div>
            {store.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-shop_orange" />
                {store.telephone}
              </div>
            )}
          </div>
        </header>

        <BoutiqueProducts
          slug={slug}
          storeName={store.nom}
          categories={categories}
        />
      </Container>
    </div>
  );
};

export default BoutiquePage;
