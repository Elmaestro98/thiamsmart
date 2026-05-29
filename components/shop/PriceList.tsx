import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import Title from "../Title";

const priceArray = [
  { title: "moins de 100000FCFA", value: "50000-100000" },
  { title: "100000FCFA - 200000FCFA", value: "100000-200000" },
  { title: "200000FCFA - 300000FCFA", value: "200000-300000" },
  { title: "300000FCFA - 400000FCFA", value: "300000-400000" },
  { title: "400000FCFA - 500000FCFA", value: "400000-500000" },
  { title: "Plus de 500000FCFA", value: "500000-10000000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Prix</Title>
      <RadioGroup
        onValueChange={(v) => setSelectedPrice(v)}
        className="mt-2 space-y-1"
        value={selectedPrice || ""}
      >
        {priceArray?.map((price, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;
