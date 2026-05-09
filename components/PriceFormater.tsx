import { twMerge } from "tailwind-merge";
interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormater = ({ amount, className }: Props) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return (
      <span
        className={twMerge(
          "text-sm sm:text-base font-semibold text-darkColor",
          className,
        )}
      >
        --
      </span>
    );
  }

  return (
    <span
      className={twMerge(
        "text-sm sm:text-base font-semibold text-darkColor",
        className,
      )}
    >
      {amount.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
      <span className="text-[10px] sm:text-xs font-medium ml-0.5">FCFA</span>
    </span>
  );
};

export default PriceFormater;
