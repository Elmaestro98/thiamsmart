import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

// Version sûre : renvoie null au lieu de lever une exception quand l'image
// n'a pas de fichier (ex. emplacement d'image ajouté dans le Studio sans upload).
export const safeImageUrl = (
  source: SanityImageSource | null | undefined,
): string | null => {
  if (!source) return null;
  try {
    return builder.image(source).url();
  } catch {
    return null;
  }
};
