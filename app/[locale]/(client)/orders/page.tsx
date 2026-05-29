import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/queries";
import { auth } from "@clerk/nextjs/server";
import {
  FileX,
  PackageOpen,
  ShoppingBag,
  ArrowRight,
  Clock,
  Package,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Utilitaire pour traduire les statuts en français
export const translateOrderStatus = (
  status: string,
): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    paid: {
      label: "Payé",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    unpaid: {
      label: "En attente de paiement",
      color: "bg-[#fb6c08]/10 text-[#fb6c08] border-[#fb6c08]/30",
    },
    pending: {
      label: "En attente",
      color: "bg-[#fb6c08]/10 text-[#fb6c08] border-[#fb6c08]/30",
    },
    processing: {
      label: "En traitement",
      color: "bg-[#26619c]/10 text-[#26619c] border-[#26619c]/30",
    },
    shipped: {
      label: "Expédié",
      color: "bg-[#26619c]/10 text-[#26619c] border-[#26619c]/30",
    },
    delivered: {
      label: "Livré",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    cancelled: {
      label: "Annulé",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    refunded: {
      label: "Remboursé",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    default: {
      label: status ?? "Inconnu",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    },
  };
  return statusMap[status?.toLowerCase()] ?? statusMap.default;
};

const OrdersPage = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const orders = await getMyOrders(userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Container className="py-12">
        {orders?.length ? (
          <div className="space-y-8">
            {/* ── En-tête ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "#fb6c08",
                    boxShadow: "0 8px 24px #fb6c0840",
                  }}
                >
                  <PackageOpen size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Mes Commandes
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {orders.length} commande{orders.length > 1 ? "s" : ""}{" "}
                    trouvée{orders.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 border"
                  style={{ background: "#fb6c0812", borderColor: "#fb6c0830" }}
                >
                  <Clock size={14} style={{ color: "#fb6c08" }} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#fb6c08" }}
                  >
                    {
                      orders.filter(
                        (o: any) =>
                          o.status === "pending" || o.status === "processing",
                      ).length
                    }{" "}
                    en cours
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 border"
                  style={{ background: "#26619c12", borderColor: "#26619c30" }}
                >
                  <Package size={14} style={{ color: "#26619c" }} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#26619c" }}
                  >
                    {
                      orders.filter(
                        (o: any) =>
                          o.status === "delivered" || o.status === "paid",
                      ).length
                    }{" "}
                    livrées
                  </span>
                </div>
              </div>
            </div>

            {/* ── Tableau ── */}
            <Card className="w-full shadow-sm border border-gray-100 rounded-2xl overflow-hidden bg-white">
              <CardHeader
                className="px-6 py-4 border-b"
                style={{
                  borderBottomColor: "#fb6c0820",
                  background: "#fb6c0808",
                }}
              >
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#fb6c08" }}
                >
                  <ShoppingBag size={14} />
                  <span>Historique des commandes</span>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea>
                  <Table>
                    <TableHeader>
                      <TableRow
                        className="hover:opacity-100 border-b-0"
                        style={{
                          background:
                            "linear-gradient(90deg, #fb6c08 0%, #26619c 100%)",
                        }}
                      >
                        <TableHead className="text-[11px] font-bold text-white/90 uppercase tracking-widest w-[130px] md:w-auto pl-6 py-3.5">
                          N° Commande
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Date
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Client
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Email
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Total
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Statut
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5">
                          Facture
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-white/90 uppercase tracking-widest text-center py-3.5 pr-6">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <OrdersComponent orders={orders} />
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* ── CTA bas de page ── */}
            <div className="flex justify-center pt-2">
              <Link
                href="shop"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
                style={{ color: "#26619c" }}
              >
                Continuer mes achats
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        ) : (
          /* ── État vide ── */
          <div className="flex flex-col items-center justify-center py-28 px-4">
            <div className="relative mb-8">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: "#26619c15" }}
              >
                <FileX className="h-11 w-11" style={{ color: "#26619c50" }} />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "#fb6c0820" }}
              >
                <ShoppingBag size={14} style={{ color: "#fb6c08" }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center leading-snug">
              Aucune commande pour le moment
            </h2>
            <p className="text-gray-500 text-center max-w-xs mb-10 leading-relaxed text-sm">
              Vous n'avez pas encore passé de commande chez LBC. Découvrez nos
              produits et lancez-vous !
            </p>

            <Button
              asChild
              className="active:scale-95 text-white rounded-xl px-8 h-11 transition-all border-0"
              style={{
                background: "#fb6c08",
                boxShadow: "0 8px 24px #fb6c0840",
              }}
            >
              <Link href="/" className="flex items-center gap-2">
                Parcourir les produits
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;

// ─── Badge de statut réutilisable ────────────────────────────────────────────
// Utilisation dans OrdersComponent : <OrderStatusBadge status={order.status} />
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
