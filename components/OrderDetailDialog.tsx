import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import {
  Download,
  Package,
  User,
  Mail,
  Calendar,
  Hash,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERY_RESULT[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 py-2">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 shrink-0">
      <Icon size={15} className="text-gray-500" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800 truncate">
        {value}
      </span>
    </div>
  </div>
);

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const subtotal =
    (order?.totalPrice as number) + (order?.amountDiscount as number);
  const hasDiscount = order?.amountDiscount !== 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-5 rounded-t-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-semibold">
                  Detail de votre commande
                </DialogTitle>
                <p className="text-gray-300 text-xs mt-0.5 font-mono">
                  #{order?.orderNumber}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 bg-gray-50 rounded-xl p-4">
            <InfoRow
              icon={User}
              label="Customer"
              value={order.customerName ?? "—"}
            />
            <InfoRow icon={Mail} label="Email" value={order.email ?? "—"} />
            <InfoRow
              icon={Calendar}
              label="Date"
              value={
                order.orderDate
                  ? format(new Date(order.orderDate), "dd MMM yyyy, HH:mm")
                  : "—"
              }
            />
            <InfoRow
              icon={Hash}
              label="Invoice Number"
              value={order?.invoice?.number ?? "—"}
            />
            <div className="flex items-center gap-3 py-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 shrink-0">
                <Package size={15} className="text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={`mt-0.5 w-fit text-xs font-semibold capitalize ${
                    order.status === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
            {order?.invoice?.hosted_invoice_url && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 shrink-0">
                  <Download size={15} className="text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Invoice
                  </span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-blue-600 font-medium"
                    asChild
                  >
                    <Link
                      href={order.invoice.hosted_invoice_url}
                      target="_blank"
                    >
                      Download PDF
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Products Table */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Items ordered ({order.products?.length ?? 0})
            </h3>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Product
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                      Qty
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                      Unit Price
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products?.map((product, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product?.product?.images?.[0] && (
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                              <Image
                                src={urlFor(product.product.images[0]).url()}
                                alt={product?.product?.name ?? "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-800 line-clamp-2">
                            {product?.product?.name ?? "Unknown product"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                          {product?.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <PriceFormatter
                          amount={product?.product?.price}
                          className="text-sm font-semibold text-gray-800"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end">
            <div className="w-56 bg-gray-50 rounded-xl p-4 space-y-2">
              {hasDiscount && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <PriceFormatter
                      amount={subtotal}
                      className="text-gray-700 font-medium"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-600 font-medium">
                      Discount
                    </span>
                    <PriceFormatter
                      amount={order?.amountDiscount}
                      className="text-emerald-600 font-medium"
                    />
                  </div>
                  <Separator className="my-1" />
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <PriceFormatter
                  amount={order?.totalPrice}
                  className="text-base font-bold text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
