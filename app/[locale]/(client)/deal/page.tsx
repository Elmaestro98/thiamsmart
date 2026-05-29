import DealClient from "@/components/DealClient";
import { Category } from "@/sanity.types";
import { getDealProducts, getCategories } from "@/sanity/queries";

// ─── Page (Server Component) ──────────────────────────────────────────────────

const DealPage = async () => {
  const products = await getDealProducts();
  const categories = await getCategories();
  return (
    <DealClient
      products={products ?? []}
      categories={categories as Category[]}
    />
  );
};

export default DealPage;
