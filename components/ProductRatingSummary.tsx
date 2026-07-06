"use client";

import { StarIcon } from "lucide-react";
import { useProductReviewsContext } from "@/components/ProductReviewsProvider";

const ProductRatingSummary = () => {
  const { average, count } = useProductReviewsContext();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={14}
            className={
              i < Math.round(average) ? "text-amber-400" : "text-gray-300"
            }
            fill={i < Math.round(average) ? "#f59e0b" : "none"}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 font-medium">
        {count > 0 ? average.toFixed(1) : "—"}
      </span>
      <span className="text-gray-300 text-sm">|</span>
      <span className="text-sm text-gray-400">{count} avis</span>
    </div>
  );
};

export default ProductRatingSummary;
