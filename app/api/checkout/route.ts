import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  // 1. Vérifier l'authentification côté serveur
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { items, addressId } = await req.json();

    // 1. Validation des entrées
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier invalide" }, { status: 400 });
    }

    if (!addressId) {
      return NextResponse.json(
        { error: "Adresse de livraison manquante" },
        { status: 400 },
      );
    }

    // 2. Vérification des configurations
    if (!process.env.SANITY_WRITE_TOKEN) {
      console.error("ERREUR: SANITY_WRITE_TOKEN est manquant");
      throw new Error("Configuration serveur incomplète (Token)");
    }

    if (!process.env.WAVE_PAYMENT_URL) {
      console.error("ERREUR: WAVE_PAYMENT_URL est manquant");
      throw new Error("Configuration serveur incomplète (Wave URL)");
    }

    // 2. Recalculer les prix côté serveur depuis Sanity (source de vérité)
    const productIds = items.map((item: { id: string }) => item.id);
    const query = `*[_type == "product" && _id in $ids]{
      _id, price, stock, name
    }`;

    // Récupérer les produits et l'adresse simultanément
    const [products, addressData] = await Promise.all([
      client.fetch(query, { ids: productIds }),
      client.fetch(`*[_type == "address" && _id == $addressId][0]`, {
        addressId,
      }),
    ]);

    if (!addressData) {
      return NextResponse.json(
        { error: "Adresse de livraison introuvable" },
        { status: 400 },
      );
    }

    // 3. Vérifier stock et calculer le montant total
    let totalAmount = 0;
    for (const item of items) {
      const product = products.find((p: { _id: string }) => p._id === item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.id}` },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour: ${product.name}` },
          { status: 400 },
        );
      }

      const price = product.price;
      if (typeof price !== "number") {
        return NextResponse.json(
          { error: `Le prix du produit ${product.name} est invalide.` },
          { status: 400 },
        );
      }
      totalAmount += price * item.quantity;
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error("Le montant total calculé est invalide (NaN ou <= 0)");
    }

    // 4. Créer la commande dans Sanity (Statut : En_Attente)
    // IMPORTANT: On utilise un client configuré avec le token d'écriture
    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false,
    });

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Email utilisateur introuvable" },
        { status: 400 },
      );
    }

    const orderNumber = `CMD-${nanoid(8).toUpperCase()}`;

    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      clerkUserId: user.id,
      customerName:
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Client",
      email: userEmail,
      status: "En_Attente",
      totalPrice: totalAmount,
      currency: "XOF",
      orderDate: new Date().toISOString(),
      address: {
        name: addressData.name,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
      },
      products: items.map((item: any) => ({
        _key: nanoid(),
        product: { _type: "reference", _ref: item.id },
        quantity: item.quantity,
      })),
    });

    // 5. Construire l'URL Wave complète
    const paymentParams = new URLSearchParams({
      amount: Math.round(totalAmount).toString(),
      currency: "XOF",
      error_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?error=payment_failed`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${order._id}`,
    });

    const waveUrl = `${process.env.WAVE_PAYMENT_URL}?${paymentParams.toString()}`;

    const orderItems = items.map((item: { id: string; quantity: number }) => {
      const product = products.find((p: { _id: string }) => p._id === item.id);
      return {
        name: product?.name ?? "Produit",
        quantity: item.quantity,
        price: product?.price ?? 0,
      };
    });

    await sendOrderConfirmationEmail({
      to: userEmail,
      customerName: order.customerName || "Client",
      orderNumber: order.orderNumber,
      items: orderItems,
      totalPrice: totalAmount,
      currency: "XOF",
      address: addressData,
    });

    await sendAdminOrderNotificationEmail({
      customerName: order.customerName || "Client",
      customerEmail: userEmail,
      customerPhone: user.phoneNumbers?.[0]?.phoneNumber,
      orderNumber: order.orderNumber,
      items: orderItems,
      totalPrice: totalAmount,
      currency: "XOF",
      address: addressData,
    });

    return NextResponse.json({
      checkoutUrl: waveUrl,
      orderId: order._id,
      amount: totalAmount,
    });
  } catch (error) {
    // Log détaillé pour le développeur dans la console du terminal
    console.error("DEBUG - Erreur détaillée Checkout API:", {
      message: error instanceof Error ? error.message : "Erreur inconnue",
      stack: error instanceof Error ? error.stack : null,
      raw: error,
    });

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors du traitement de votre commande.",
      },
      { status: 500 },
    );
  }
}
