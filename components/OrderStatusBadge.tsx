// Statuts possibles définis dans sanity/schemaTypes/orderTypes.ts
export const translateOrderStatus = (
  status: string,
): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    En_Attente: {
      label: "En attente",
      color: "bg-[#fb6c08]/10 text-[#fb6c08] border-[#fb6c08]/30",
    },
    En_Traitement: {
      label: "En traitement",
      color: "bg-[#26619c]/10 text-[#26619c] border-[#26619c]/30",
    },
    Payée: {
      label: "Payée",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    Expédiée: {
      label: "Expédiée",
      color: "bg-[#26619c]/10 text-[#26619c] border-[#26619c]/30",
    },
    En_cours: {
      label: "En cours de livraison",
      color: "bg-[#26619c]/10 text-[#26619c] border-[#26619c]/30",
    },
    Livrée: {
      label: "Livrée",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    Annulée: {
      label: "Annulée",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    default: {
      label: status ?? "Inconnu",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    },
  };
  return statusMap[status] ?? statusMap.default;
};

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const { label, color } = translateOrderStatus(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}
    >
      {label}
    </span>
  );
};
