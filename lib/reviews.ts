export interface ReviewItem {
  _id: string;
  _createdAt: string;
  customerName: string;
  rating: number;
  comment?: string | null;
}

export const computeRatingSummary = (reviews: ReviewItem[]) => {
  const count = reviews.length;
  const average =
    count === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / count;
  return { average, count };
};
