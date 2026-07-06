import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const storeType = defineType({
  name: "store",
  title: "Boutiques",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "nom",
      title: "Nom de la boutique",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "nom",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "adresse",
      title: "Adresse",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "telephone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "position",
      title: "Position sur la carte",
      type: "geopoint",
      description: "Clique sur la carte pour placer la boutique",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          const { lat, lng } = value;
          if (lat < 12 || lat > 17) {
            return `Latitude hors du Sénégal (${lat}). Attendu entre 12 et 17.`;
          }
          if (lng < -18 || lng > -11) {
            return `Longitude hors du Sénégal (${lng}). As-tu oublié le signe négatif (-) ? Attendu entre -18 et -11.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "ordre",
      title: "Ordre d'affichage",
      type: "number",
      description: "Les boutiques avec le plus petit nombre apparaissent en premier",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "nom",
      subtitle: "adresse",
    },
  },
});
