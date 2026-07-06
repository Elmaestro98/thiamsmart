import { Metadata } from "next";
import HommeBanner from "@/components/HommeBanner";
import Container from "@/components/Container";
import ProductGrid from "@/components/ProductGrid";
import Topproduct from "@/components/Topproduct";
import HomeCategories from "@/components/HommeCatégories";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories, getStores } from "@/sanity/queries";
import MapLoader from "@/components/MapLoader";
import HomeBoutiques from "@/components/HomeBoutiques";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Commander et acheter tout vos produits electromenager en un clic",
};

const Home = async () => {
  const [categories, stores] = await Promise.all([
    getCategories(6),
    getStores(),
  ]);
  return (
    <Container>
      <HommeBanner />
      <Topproduct />
      <div className="py-10">
        <ProductGrid />
      </div>
      <HomeCategories categories={categories} />
      <ShopByBrands />
      <MapLoader stores={stores} />
      <HomeBoutiques stores={stores} />
    </Container>
  );
};

export default Home;
