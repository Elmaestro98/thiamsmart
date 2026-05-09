import Container from "./Container";
import Image from "next/image";
import client from "@/sanity/lib/client";
import { TOP_PRODUCTS_QUERY } from "@/sanity/queries/query";

type Product = {
  _id: string;
  name: string;
  imageUrl: string;
  image?: {
    asset?: {
      url: string;
      _ref?: string;
    };
    alt?: string;
  };
  imageDimensions?: {
    width: number;
    height: number;
  };
};

export default async function Topproduct() {
  const products: Product[] = await client.fetch(TOP_PRODUCTS_QUERY);
  return (
    <section className="w-full py-12">
      <Container>
        <h2 className="text-2xl font-bold text-center mb-10 text-shop_light_brown">
          Top produits
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div key={product._id} className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 cursor-pointer sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-shop_light_brown shadow-lg hover:shadow-xl transition-shadow duration-300 relative bg-gray-100">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={112}
                    height={112}
                    priority={index < 3}
                    className="object-cover w-full h-full"
                    quality={85}
                  />
                )}
              </div>
              <span className="text-sm font-medium text-center max-w-[100px] sm:max-w-[120px] line-clamp-2 hover:line-clamp-none">
                {product.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
