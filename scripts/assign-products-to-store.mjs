// Script de migration ponctuel : attribue tous les produits existants à une boutique.
// Utilisation : node --env-file=.env.local scripts/assign-products-to-store.mjs
import { createClient } from "@sanity/client";

const STORE_NAME = process.argv[2] || "Keur Massar";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Variables d'environnement manquantes (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function run() {
  const store = await client.fetch(
    `*[_type == "store" && (nom match $q || adresse match $q)][0]{_id, nom, adresse}`,
    { q: `*${STORE_NAME}*` },
  );

  if (!store) {
    console.error(
      `Boutique "${STORE_NAME}" introuvable. Crée-la d'abord dans Sanity Studio (/studio).`,
    );
    process.exit(1);
  }

  console.log(`Boutique trouvée : ${store.nom} (${store.adresse}) [${store._id}]`);

  const products = await client.fetch(`*[_type == "product"]{_id, name, stores}`);
  console.log(`${products.length} produit(s) trouvé(s) au total.`);

  let updated = 0;
  for (const product of products) {
    const alreadyLinked = (product.stores ?? []).some(
      (ref) => ref._ref === store._id,
    );
    if (alreadyLinked) continue;

    const newStores = [
      ...(product.stores ?? []),
      { _type: "reference", _ref: store._id, _key: store._id },
    ];

    await client.patch(product._id).set({ stores: newStores }).commit();
    updated++;
    console.log(`  ✔ ${product.name}`);
  }

  console.log(`\nTerminé : ${updated} produit(s) rattaché(s) à "${store.nom}" (${products.length - updated} l'étaient déjà).`);
}

run().catch((err) => {
  console.error("Erreur pendant la migration :", err);
  process.exit(1);
});
