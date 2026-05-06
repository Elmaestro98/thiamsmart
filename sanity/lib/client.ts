import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// Client sans cache pour les requêtes dynamiques (Shop, filtres, etc.)
export const dynamicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ← Données toujours fraîches
});

export default client;
