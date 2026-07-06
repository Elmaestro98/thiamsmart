import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

// Assurez-vous que vos variables d'environnement sont bien chargées
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: false, // false car on écrit des données
  token: process.env.SANITY_API_TOKEN, // Token avec droits d'écriture
});

export async function POST(request: Request) {
  if (!process.env.SANITY_API_TOKEN) {
    console.error(
      "❌ ERREUR: Le token SANITY_API_TOKEN est introuvable. Avez-vous redémarré le serveur après l'avoir ajouté au fichier .env.local ?",
    );
    return NextResponse.json(
      { message: "Erreur de configuration : Token API manquant." },
      { status: 500 },
    );
  }

  try {
    const { email } = await request.json();

    // Validation simple de l'email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "L'adresse e-mail est invalide." },
        { status: 400 },
      );
    }

    // Vérifier si l'email existe déjà pour éviter les doublons
    const existingSubscriber = await client.fetch(
      `*[_type == "newsletter" && email == $email][0]`,
      { email },
    );

    if (existingSubscriber) {
      return NextResponse.json(
        { message: "Cet e-mail est déjà inscrit." },
        { status: 409 }, // 409 Conflict est plus sémantique ici
      );
    }

    // Créer le nouveau document dans Sanity
    await client.create({
      _type: "newsletter",
      email,
    });

    return NextResponse.json(
      { message: "Inscription réussie ! Merci." },
      { status: 201 }, // 201 Created
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription à la newsletter:", error);
    return NextResponse.json(
      { message: "Une erreur interne est survenue. Veuillez réessayer." },
      { status: 500 },
    );
  }
}
