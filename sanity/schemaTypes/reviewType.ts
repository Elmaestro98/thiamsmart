import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Avis clients",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Produit",
      type: "reference",
      to: { type: "product" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "ID Utilisateur",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Nom du client",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Note (1 à 5)",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "comment",
      title: "Commentaire",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "comment",
      rating: "rating",
    },
    prepare(selection) {
      const { title, subtitle, rating } = selection;
      return {
        title: `${title} — ${"⭐".repeat(rating ?? 0)}`,
        subtitle,
        media: StarIcon,
      };
    },
  },
});
