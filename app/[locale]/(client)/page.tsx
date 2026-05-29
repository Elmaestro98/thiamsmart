import { Metadata } from "next";
import HommeBanner from "@/components/HommeBanner";
import Container from "@/components/Container";
import ProductGrid from "@/components/ProductGrid";
import Topproduct from "@/components/Topproduct";
import HomeCategories from "@/components/HommeCatégories";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "@/sanity/queries";
import MapLoader from "@/components/MapLoader";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Commander et acheter tout vos produits electromenager en un clic",
};

const Home = async () => {
  const categories = await getCategories(6);
  return (
    <Container>
      <HommeBanner />
      <Topproduct />
      <div className="py-10">
        <ProductGrid />
      </div>
      <HomeCategories categories={categories} />
      <ShopByBrands />
      <MapLoader />
    </Container>
  );
};

export default Home;
