import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Produits",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom produit",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Image du produit",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Prix (FCFA)",
      type: "number",
      description: "Prix du produit en franc CFA (FCFA)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Prix marketing",
      description: "Prix barré / prix avant remise en (en FCFA)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stores",
      title: "Boutiques",
      description: "Boutiques où ce produit est disponible",
      type: "array",
      of: [{ type: "reference", to: { type: "store" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Marque",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Status du produit",
      type: "string",
      options: {
        list: [
          { title: "Nouveau", value: "nouveau" },
          { title: "Tendance", value: "tendance" },
          { title: "En Promotion", value: "promotion" },
        ],
      },
    }),

    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Gadgets high-tech", value: "gadget" },
          { title: "Appareil Electromenager", value: "appliances" },

          { title: "Others", value: "others" },
        ],
      },
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "images.0",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;

      return {
        title: title,
        subtitle: `${subtitle} FCFA`,
        media,
      };
    },
  },
});
