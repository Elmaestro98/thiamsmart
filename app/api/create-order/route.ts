import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  // 1. Vérifier l'authentification
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await currentUser();

  const {
    items,
    addressId,
    totalPrice,
    paymentMethod = "wave",
  } = await req.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Panier invalide" }, { status: 400 });
  }

  // 2. Récupérer les produits depuis Sanity
  const productIds = items.map((item: { id: string }) => item.id);
  const query = `*[_type == "product" && _id in $ids]{ _id, price, discountedPrice, stock, name }`;
  const products = await client.fetch(query, { ids: productIds });

  // 3. Récupérer l'adresse depuis Sanity
  const addressQuery = `*[_type == "address" && _id == $addressId][0]`;
  const address = await client.fetch(addressQuery, { addressId });

  // 4. Calculer le montant total côté serveur
  let total = 0;
  for (const item of items) {
    const product = products.find((p: { _id: string }) => p._id === item.id);
    if (!product) {
      return NextResponse.json(
        { error: `Produit introuvable: ${item.id}` },
        { status: 400 },
      );
    }
    const price = product.discountedPrice ?? product.price;
    total += price * item.quantity;
  }

  // 5. Créer la commande dans Sanity
  const orderNumber = `ORD-${nanoid(10).toUpperCase()}`;

  const order = await client
    .withConfig({ token: process.env.SANITY_WRITE_TOKEN })
    .create({
      _type: "order",
      orderNumber,
      clerkUserId: userId,
      customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      email: user?.emailAddresses?.[0]?.emailAddress ?? "",
      phone: user?.phoneNumbers?.[0]?.phoneNumber ?? "",
      products: items.map((item: { id: string; quantity: number }) => ({
        _key: nanoid(),
        product: {
          _type: "reference",
          _ref: item.id,
        },
        quantity: item.quantity,
      })),
      totalPrice: total,
      currency: "XOF",
      amountDiscount: Math.max(0, total - (totalPrice ?? total)),
      address: address
        ? {
            name: address.name ?? "",
            address: address.address ?? "",
            city: address.city ?? "",
            state: address.state ?? "",
            zip: address.zip ?? "",
          }
        : null,
      paymentMethod,
      status: "pending",
      orderDate: new Date().toISOString(),
    });

  return NextResponse.json({
    success: true,
    orderNumber: order.orderNumber,
    orderId: order._id,
  });
}
