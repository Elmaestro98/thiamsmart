"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { computeRatingSummary, type ReviewItem } from "@/lib/reviews";

interface ProductReviewsContextValue {
  reviews: ReviewItem[];
  average: number;
  count: number;
  upsertReview: (review: ReviewItem) => void;
}

const ProductReviewsContext = createContext<ProductReviewsContextValue | null>(
  null,
);

export const ProductReviewsProvider = ({
  initialReviews,
  children,
}: {
  initialReviews: ReviewItem[];
  children: ReactNode;
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  const upsertReview = (review: ReviewItem) => {
    setReviews((prev) => [review, ...prev.filter((r) => r._id !== review._id)]);
  };

  const { average, count } = useMemo(() => computeRatingSummary(reviews), [reviews]);

  const value = useMemo<ProductReviewsContextValue>(
    () => ({ reviews, average, count, upsertReview }),
    [reviews, average, count],
  );

  return (
    <ProductReviewsContext.Provider value={value}>
      {children}
    </ProductReviewsContext.Provider>
  );
};

export const useProductReviewsContext = () => {
  const ctx = useContext(ProductReviewsContext);
  if (!ctx) {
    throw new Error(
      "useProductReviewsContext must be used within a ProductReviewsProvider",
    );
  }
  return ctx;
};
