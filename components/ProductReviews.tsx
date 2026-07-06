"use client";

import { useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { StarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { type ReviewItem } from "@/lib/reviews";
import { useProductReviewsContext } from "@/components/ProductReviewsProvider";

export type { ReviewItem };

interface Props {
  productId: string;
}

const Stars = ({
  value,
  size = 16,
  interactive = false,
  onChange,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hovered || value) : star <= value;
        return (
          <StarIcon
            key={star}
            size={size}
            className={`${filled ? "text-amber-400" : "text-gray-300"} ${
              interactive ? "cursor-pointer" : ""
            }`}
            fill={filled ? "#f59e0b" : "none"}
            onMouseEnter={interactive ? () => setHovered(star) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            onClick={interactive ? () => onChange?.(star) : undefined}
          />
        );
      })}
    </div>
  );
};

const ProductReviews = ({ productId }: Props) => {
  const { isSignedIn, user } = useUser();
  const { reviews, average, count, upsertReview } = useProductReviewsContext();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const myExistingReview = reviews.find((r) => r.customerName === user?.fullName);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error("Choisis une note entre 1 et 5 étoiles.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue.");
        return;
      }
      toast.success(data.message ?? "Avis enregistré, merci !");
      if (data.review) {
        upsertReview(data.review);
      }
      setRating(0);
      setComment("");
    } catch {
      toast.error("Impossible d'envoyer votre avis. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
      {/* Résumé */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-900">
          {average.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1">
          <Stars value={Math.round(average)} />
          <span className="text-sm text-gray-500">
            {count} {count > 1 ? "avis" : "avis"}
          </span>
        </div>
      </div>

      {/* Liste des avis */}
      {count > 0 && (
        <div className="space-y-4 divide-y divide-gray-100">
          {reviews.map((review) => (
            <div key={review._id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {review.customerName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(review._createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <Stars value={review.rating} size={13} />
              {review.comment && (
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire */}
      <div className="pt-4 border-t border-gray-100">
        {isSignedIn ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              {myExistingReview ? "Modifier mon avis" : "Laisser un avis"}
            </p>
            <Stars value={rating} interactive size={22} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partage ton expérience avec ce produit (optionnel)"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-shop_orange/30 focus:border-shop_orange"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-shop_orange text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Envoi..." : "Envoyer mon avis"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SignInButton mode="modal">
              <button className="text-shop_orange font-semibold hover:underline">
                Connecte-toi
              </button>
            </SignInButton>
            pour laisser un avis sur ce produit.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
