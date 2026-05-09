import { Metadata } from "next";
import HommeBanner from "@/components/HommeBanner";
import Container from "@/components/Container";
import Topproduct from "@/components/Topproduct";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Commander et achetr tout vos produits electromenager en un clic",
};

const Home = async () => {
  return (
    <Container>
      <HommeBanner />
      <Topproduct />
    </Container>
  );
};

export default Home;
