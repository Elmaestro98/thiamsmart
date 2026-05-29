import { Category } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

// On étend le type car le schéma Sanity semble utiliser 'titre' au lieu de 'title'
// et le slug peut arriver sous forme de string ou d'objet selon la requête GROQ.
type CategoryData = Category & { productCount: number; titre?: string };

interface Props {
  categories: CategoryData[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Categories</Title>
      <RadioGroup
        onValueChange={(v) => setSelectedCategory(v)}
        value={selectedCategory || ""}
        className="mt-2 space-y-1"
      >
        {categories?.map((category) => {
          // Utilisation de 'titre' avec fallback sur 'title'
          const name = category?.titre || category?.title;
          // Gestion du slug (objet Sanity ou string directe)
          const slug =
            category?.slug?.current ||
            (category?.slug as unknown as string) ||
            "";

          return (
            <div
              key={category?._id}
              className="flex items-center justify-between space-x-2 hover:cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={slug} id={slug} className="rounded-sm" />
                <Label
                  htmlFor={slug}
                  className={`${selectedCategory === slug ? "font-semibold text-black" : "font-normal"}`}
                >
                  {name}
                </Label>
              </div>
              <span className="text-sm">({category?.productCount})</span>
            </div>
          );
        })}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
