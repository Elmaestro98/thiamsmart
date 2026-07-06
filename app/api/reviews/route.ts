import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour laisser un avis." },
      { status: 401 },
    );
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error("ERREUR: SANITY_WRITE_TOKEN est manquant");
    return NextResponse.json(
      { error: "Configuration serveur incomplète." },
      { status: 500 },
    );
  }

  try {
    const { productId, rating, comment } = await req.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Produit invalide." },
        { status: 400 },
      );
    }

    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { error: "La note doit être comprise entre 1 et 5." },
        { status: 400 },
      );
    }

    const productExists = await client.fetch(
      `*[_type == "product" && _id == $productId][0]._id`,
      { productId },
    );
    if (!productExists) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 },
      );
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false,
    });

    const customerName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Client";

    // Un avis existant du même client pour ce produit est mis à jour plutôt que dupliqué
    const existingReview = await client.fetch(
      `*[_type == "review" && product._ref == $productId && clerkUserId == $userId][0]._id`,
      { productId, userId: user.id },
    );

    let savedReview;
    if (existingReview) {
      savedReview = await writeClient
        .patch(existingReview)
        .set({ rating: parsedRating, comment: comment ?? "", customerName })
        .commit();
    } else {
      savedReview = await writeClient.create({
        _type: "review",
        product: { _type: "reference", _ref: productId },
        clerkUserId: user.id,
        customerName,
        rating: parsedRating,
        comment: comment ?? "",
      });
    }

    revalidateTag(`reviews-${productId}`, "max");

    return NextResponse.json(
      {
        message: "Avis enregistré, merci !",
        review: {
          _id: savedReview._id,
          _createdAt: savedReview._createdAt ?? new Date().toISOString(),
          customerName,
          rating: parsedRating,
          comment: comment ?? "",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'avis:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
