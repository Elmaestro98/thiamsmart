export type FAQCategory = {
  id: string;
  label: string;
  icon: string;
};

export type FAQItem = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
};

export const categories: FAQCategory[] = [
  { id: "all", label: "Toutes", icon: "ti-layout-grid" },
  { id: "commande", label: "Commande", icon: "ti-shopping-cart" },
  { id: "livraison", label: "Livraison", icon: "ti-truck" },
  { id: "garantie", label: "Garantie", icon: "ti-shield-check" },
  { id: "retour", label: "Retours", icon: "ti-arrow-back-up" },
  { id: "paiement", label: "Paiement", icon: "ti-credit-card" },
  { id: "installation", label: "Installation", icon: "ti-tool" },
];

export const faqs: FAQItem[] = [
  {
    id: "1",
    categoryId: "commande",
    question: "Comment puis-je passer une commande sur votre site ?",
    answer:
      "Passez votre commande en quelques étapes : sélectionnez l'article souhaité, ajoutez-le au panier, puis suivez les étapes de validation.  Vousvous connectez pour un suivi simplifié.",
  },
  {
    id: "2",
    categoryId: "commande",
    question: "Puis-je modifier ou annuler ma commande après validation ?",
    answer:
      "Vous pouvez modifier ou annuler votre commande dans un délai de 2h après validation, avant la prise en charge par notre entrepôt. Contactez notre service client par téléphone au +221 77 471 45 45 ",
  },

  {
    id: "3",
    categoryId: "commande",
    question: "Comment suivre l'état de ma commande ?",
    answer:
      "Suivez votre commande depuis votre espace client, rubrique « Mes commandes ».",
  },

  {
    id: "4",
    categoryId: "livraison",
    question: "Quels sont les délais de livraison ?",
    answer: "Thiamsmart vous livres tout vos produit en moin de 24h",
  },

  {
    id: "5",
    categoryId: "livraison",
    question: "La livraison est-elle gratuite ?",
    answer: "La livraison est gratuite , partout Dakar",
  },
  {
    id: "6",
    categoryId: "livraison",
    question: "Proposez-vous la livraison avec installation ?",
    answer:
      "Oui, nous proposons un service de livraison avec mise en service pour les gros appareils (lave-linge, lave-vaisselle, four encastrable...). ",
  },

  {
    id: "7",
    categoryId: "retour",
    question: "Quel est le délai pour retourner un produit ?",
    answer:
      "Vous disposez de 30 jours à compter de la réception pour retourner tout article non utilisé dans son emballage d'origine. Pour les produits défectueux, aucun délai ne s'applique dans le cadre de la garantie légale.",
  },
  {
    id: "8",
    categoryId: "retour",
    question: "Comment effectuer un retour ?",
    answer:
      "Initiez votre retour en contactant notre service client au +221 77 471 45 45",
  },
];
