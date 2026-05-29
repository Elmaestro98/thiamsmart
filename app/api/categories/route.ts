import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/queries/query";

export async function GET() {
  try {
    // Verify environment variables
    if (
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET
    ) {
      console.error("Missing Sanity environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 503 },
      );
    }

    const categories = await client.fetch(CATEGORIES_QUERY);

    if (!categories || categories.length === 0) {
      console.warn("No categories found in Sanity");
      console.log("Réponse de l'API: Aucune catégorie trouvée.");
      return NextResponse.json([]);
    }

    console.log("Catégories récupérées de Sanity:", categories);
    return NextResponse.json(categories);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to fetch categories from Sanity:", {
      error: errorMessage,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    });
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
