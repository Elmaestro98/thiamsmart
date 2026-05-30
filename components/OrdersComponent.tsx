"use client";

import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import toast from "react-hot-toast";

interface OrdersComponentProps {
  orders: MY_ORDERS_QUERY_RESULT;
  onDeleteOrder?: (orderId: string) => Promise<void>; // scalable: optionally injectable
}

const STATUS_STYLES: Record<string, string> = {
  payé: "bg-emerald-50 text-emerald-700 border-emerald-200",
  en_attente: "bg-amber-50 text-amber-700 border-amber-200",
  annulé: "bg-red-50 text-red-700 border-red-200",
  remboursé: "bg-gray-100 text-gray-600 border-gray-200",
};

const OrdersComponent = ({ orders, onDeleteOrder }: OrdersComponentProps) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERY_RESULT[number] | null
  >(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    if (onDeleteOrder) {
      setDeletingId(orderId);
      try {
        await onDeleteOrder(orderId);
        toast.success("Commande supprimé");
      } catch {
        toast.error("Echec de la suppression de la commande");
      } finally {
        setDeletingId(null);
      }
    } else {
      toast.error("La suppression est réservée aux administrateurs");
    }
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow
            className="hover:opacity-100 border-b-0"
            style={{
              background: "linear-gradient(90deg, #fb6c08 0%, #26619c 100%)",
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
        <TableBody>
          {orders.map((order) => {
            const statusStyle =
              STATUS_STYLES[order.status ?? ""] ??
              "bg-gray-100 text-gray-600 border-gray-200";
            const isDeleting = deletingId === order.orderNumber;

            return (
              <Tooltip key={order?.orderNumber}>
                <TooltipTrigger asChild>
                  <TableRow
                    className={`cursor-pointer transition-colors h-14 ${
                      isDeleting
                        ? "opacity-40 pointer-events-none"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order number */}
                    <TableCell className="font-mono text-xs text-gray-500 max-w-[120px]">
                      <span className="truncate block">
                        …{order.orderNumber?.slice(-10) ?? "N/A"}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="hidden md:table-cell text-sm text-gray-600">
                      {order?.orderDate &&
                        format(new Date(order.orderDate), "dd MMM yyyy")}
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="font-medium text-sm text-gray-800">
                      {order.customerName}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500 max-w-[180px]">
                      <span className="truncate block">{order.email}</span>
                    </TableCell>

                    {/* Total */}
                    <TableCell>
                      <PriceFormatter
                        amount={order?.totalPrice}
                        className="text-sm font-semibold text-gray-900"
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {order?.status && (
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold capitalize ${statusStyle}`}
                        >
                          {order.status}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Invoice */}
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs font-mono text-gray-500">
                        {order?.invoice?.number ?? "—"}
                      </span>
                    </TableCell>

                    {/* Delete action */}
                    <TableCell
                      onClick={(e) => handleDelete(e, order.orderNumber ?? "")}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center">
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Delete order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Cliquez pour voir les détails de la commande
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TableBody>
      </Table>

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </TooltipProvider>
  );
};

export default OrdersComponent;
