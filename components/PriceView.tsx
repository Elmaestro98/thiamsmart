import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount?: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Prix actuel */}
      <PriceFormatter
        amount={price}
        className={cn("text-shop_orange font-bold", className)}
      />

      {/* Prix barré */}
      {price && discount && (
        <PriceFormatter
          amount={discount}
          className={twMerge(
            "line-through font-normal text-zinc-400",
            className,
          )}
        />
      )}
    </div>
  );
};

export default PriceView;
