import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_CATEGORY_QUERY } from "@/sanity/queries/query";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "Missing categoryId parameter" },
      { status: 400 },
    );
  }

  try {
    const products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
      categoryId,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products by category from Sanity:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
