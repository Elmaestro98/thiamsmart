import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

/**
 * Vrai seulement si l'image Sanity contient vraiment un fichier.
 * Une "case image" ajoutée dans le Studio sans photo n'a pas d'`asset`
 * et ferait planter `urlFor(...).url()`.
 */
export function hasImage<T>(img: T | null | undefined): img is NonNullable<T> {
  return (
    typeof img === "object" &&
    img !== null &&
    Boolean((img as { asset?: unknown }).asset)
  );
}

/** Garde uniquement les images qui contiennent vraiment un fichier. */
export function getValidImages<T>(
  images?: readonly (T | null | undefined)[] | null,
): NonNullable<T>[] {
  return (images ?? []).filter((img): img is NonNullable<T> => hasImage(img));
}

/** Première image valide d'une liste, ou `undefined` s'il n'y en a aucune. */
export function getFirstImage<T>(
  images?: readonly (T | null | undefined)[] | null,
): NonNullable<T> | undefined {
  return getValidImages(images)[0];
}
