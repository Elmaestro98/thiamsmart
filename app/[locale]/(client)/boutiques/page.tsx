import { Metadata } from "next";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getStores } from "@/sanity/queries";
import Link from "next/link";
import { MapPin, Phone, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos boutiques",
  description: "Retrouvez toutes nos boutiques Thiamsmart près de chez vous.",
};

const BoutiquesPage = async () => {
  const stores = await getStores();

  return (
    <div className="py-10 bg-gray-50/50 min-h-screen">
      <Container>
        <header className="mb-10">
          <Title className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Nos boutiques
          </Title>
          <div className="h-1.5 w-20 bg-shop_orange mt-4 rounded-full" />
        </header>

        {stores?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store: any) => (
              <div
                key={store._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <h2 className="font-bold text-lg text-gray-900 mb-3">
                  {store.nom}
                </h2>

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
        ) : (
          <p className="text-gray-500">Aucune boutique disponible pour le moment.</p>
        )}
      </Container>
    </div>
  );
};

export default BoutiquesPage;
