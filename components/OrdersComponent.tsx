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
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import { OrderStatusBadge } from "./OrderStatusBadge";
import Pagination from "./Pagination";

interface OrdersComponentProps {
  orders: MY_ORDERS_QUERY_RESULT;
}

const ORDERS_PER_PAGE = 10;

const OrdersComponent = ({ orders }: OrdersComponentProps) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERY_RESULT[number] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  return (
    <>
      <ScrollArea>
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
              <TableHead className="hidden sm:table-cell text-[11px] font-bold text-white/90 uppercase tracking-widest py-3.5 pr-6">
                Facture
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TooltipProvider>
              {paginatedOrders.map((order) => {
                return (
                  <Tooltip key={order?.orderNumber}>
                    <TooltipTrigger asChild>
                      <TableRow
                        className="cursor-pointer transition-colors h-14 hover:bg-gray-50"
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
                          <span className="truncate block">
                            {order.email}
                          </span>
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
                            <OrderStatusBadge status={order.status} />
                          )}
                        </TableCell>

                        {/* Invoice */}
                        <TableCell className="hidden sm:table-cell pr-6">
                          <span className="text-xs font-mono text-gray-500">
                            {order?.invoice?.number ?? "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Cliquez pour voir les détails de la commande
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {totalPages > 1 && (
        <div className="pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
