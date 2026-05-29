import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();

    // "default" est un mot réservé JS mais parfaitement valide comme clé
    // dans un objet JSON reçu via req.json(). Le renommage en isDefault
    // est fait côté client (AddAddressModal) avant l'envoi, puis remappé
    // en "default" dans le body pour rester cohérent avec le schéma Sanity.
    const { name, address, city, state, zip, default: isDefault } = body;

    if (!name || !address || !city) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 },
      );
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false,
    });

    // Si la nouvelle adresse est marquée par défaut, on retire ce flag
    // sur toutes les adresses existantes de l'utilisateur.
    if (isDefault) {
      const existingDefaults = await writeClient.fetch<string[]>(
        `*[_type == "address" && clerkUserId == $userId && default == true]._id`,
        { userId },
      );

      await Promise.all(
        existingDefaults.map((id) =>
          writeClient.patch(id).set({ default: false }).commit(),
        ),
      );
    }

    const newAddress = await writeClient.create({
      _type: "address",
      clerkUserId: userId,
      name,
      address,
      city,
      state: state || "",
      zip: zip || "",
      default: !!isDefault,
    });

    return NextResponse.json(
      { message: "Adresse enregistrée avec succès !", address: newAddress },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'adresse:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 },
    );
  }
}
