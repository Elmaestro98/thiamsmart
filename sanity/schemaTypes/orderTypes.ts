import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Commande",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Numéro de commande",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wavePaymentRef",
      title: "Référence paiement Wave",
      type: "string",
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
      name: "email",
      title: "Email du client",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Téléphone du client",
      type: "string",
    }),
    defineField({
      name: "products",
      title: "Produits",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Produit",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantité",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity} FCFA`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Prix total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Devise",
      type: "string",
      initialValue: "XOF",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Remise",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Adresse de livraison",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Nom", type: "string" }),
        defineField({ name: "address", title: "Adresse", type: "string" }),
        defineField({ name: "city", title: "Ville", type: "string" }),
        defineField({ name: "state", title: "Région", type: "string" }),
        defineField({ name: "zip", title: "Code postal", type: "string" }),
      ],
    }),
    defineField({
      name: "paymentMethod",
      title: "Méthode de paiement",
      type: "string",
      options: {
        list: [
          { title: "Wave", value: "wave" },
          { title: "WhatsApp (sans paiement)", value: "whatsapp" },
          { title: "Paiement à la livraison", value: "cash_on_delivery" },
        ],
      },
      initialValue: "wave",
    }),
    defineField({
      name: "status",
      title: "Statut de la commande",
      type: "string",
      options: {
        list: [
          { title: "⏳ En attente", value: "En_Attente" },
          { title: "⚙️ En traitement", value: "En_Traitement" },
          { title: "✅ Payée", value: "Payée" },
          { title: "📦 Expédiée", value: "Expédiée" },
          { title: "🚚 En cours de livraison", value: "En_cours" },
          { title: "🏠 Livrée", value: "Livrée" },
          { title: "❌ Annulée", value: "Annulée" },
        ],
      },
      initialValue: "En_Attente",
    }),
    defineField({
      name: "orderDate",
      title: "Date de commande",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      status: "status",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId?.slice(0, 5)}...${select.orderId?.slice(-5)}`;
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount?.toLocaleString("fr-FR")} ${select.currency} — ${select.status}`,
        media: BasketIcon,
      };
    },
  },
});
