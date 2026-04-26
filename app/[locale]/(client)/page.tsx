import { Metadata } from "next";
import HommeBanner from "@/components/HommeBanner";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Commander et achetr tout vos produits electromenager en un clic",
};

const Home = async () => {
  return (
    <Container>
      <HommeBanner />
    </Container>
  );
};

export default Home;
