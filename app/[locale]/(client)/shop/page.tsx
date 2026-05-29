import Shop from "@/components/Shop";
import { Category } from "@/sanity.types";
import { getAllBrands, getCategories } from "@/sanity/queries";

export const dynamic = "force-dynamic";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-white">
      <Shop
        categories={categories as (Category & { productCount: number })[]}
        brands={brands}
      />
    </div>
  );
};

export default ShopPage;
