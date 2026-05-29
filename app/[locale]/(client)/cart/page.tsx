"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import FavoriteButton from "@/components/FavoriteButton";
import Title from "@/components/Title";
import AddAddressModal from "@/components/AddAddressModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { Lock, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
type LoadingState = {
  addresses: boolean;
  wave: boolean;
  whatsapp: boolean;
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

if (process.env.NODE_ENV === "development" && !WHATSAPP_NUMBER) {
  console.warn(
    "⚠️ NEXT_PUBLIC_WHATSAPP_NUMBER est manquant dans vos variables d'environnement.",
  );
}

// ─── Sous-composants extraits (hors CartPage pour éviter les remontages) ──────

interface ActionButtonsProps {
  fullWidth?: boolean;
  isProcessing: boolean;
  loadingWhatsapp: boolean;
  loadingWave: boolean;
  onCommander: () => void;
  onCheckout: () => void;
}

const ActionButtons = ({
  fullWidth = false,
  isProcessing,
  loadingWhatsapp,
  loadingWave,
  onCommander,
  onCheckout,
}: ActionButtonsProps) => (
  <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
    <Button
      size="lg"
      className={`rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium ${fullWidth ? "w-full" : ""}`}
      disabled={isProcessing}
      onClick={onCommander}
    >
      <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
      {loadingWhatsapp ? "Envoi en cours…" : "Commander via WhatsApp"}
    </Button>

    <Button
      size="lg"
      className={`rounded-lg font-medium ${fullWidth ? "w-full" : ""}`}
      disabled={isProcessing}
      onClick={onCheckout}
    >
      {loadingWave ? "Veuillez patienter…" : "Passer à la caisse — Wave"}
    </Button>

    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-1">
      <Lock className="w-3 h-3" />
      Paiement sécurisé
    </p>
  </div>
);

interface AddressSectionProps {
  loading: boolean;
  addresses: Address[] | null;
  selectedAddress: Address | null;
  onSelect: (addr: Address) => void;
  onAdd: () => void;
}

const AddressSection = ({
  loading,
  addresses,
  selectedAddress,
  onSelect,
  onAdd,
}: AddressSectionProps) => (
  <Card className="mt-4">
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Adresse de livraison</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : addresses && addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddress?._id?.toString() ?? ""}
          onValueChange={(val) => {
            const addr = addresses.find((a) => a._id.toString() === val);
            if (addr) onSelect(addr);
          }}
          className="space-y-2"
        >
          {addresses.map((address) => {
            const isSelected = selectedAddress?._id === address._id;
            return (
              <label
                key={address._id}
                htmlFor={`address-${address._id}`}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-border hover:bg-accent"
                }`}
              >
                <RadioGroupItem
                  value={address._id.toString()}
                  id={`address-${address._id}`}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{address.name}</span>
                    {address.default && (
                      <Badge
                        variant="secondary"
                        className="text-xs py-0 px-1.5 h-4"
                      >
                        par défaut
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {[address.address, address.city, address.state, address.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      ) : (
        <p className="text-sm text-muted-foreground py-2">
          Aucune adresse enregistrée.
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4"
        onClick={onAdd}
      >
        + Ajouter une adresse
      </Button>
    </CardContent>
  </Card>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, resetCart } =
    useStore();

  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn, userId } = useAuth();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    addresses: false,
    wave: false,
    whatsapp: false,
  });

  const isProcessing = loading.wave || loading.whatsapp;

  // ─── Fetch adresses ──────────────────────────────────────────────────────
  const fetchAddresses = useCallback(async () => {
    if (!isSignedIn || !userId) return;

    setLoading((prev) => ({ ...prev, addresses: true }));
    try {
      const query = `*[_type=="address" && clerkUserId == $userId] | order(publishedAt desc)`;
      const data: Address[] = await client.fetch(query, { userId });
      setAddresses(data);

      const defaultAddr = data.find((a) => a.default) ?? data[0] ?? null;
      setSelectedAddress(defaultAddr);
    } catch {
      toast.error("Impossible de récupérer vos adresses. Réessayez.");
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  }, [isSignedIn, userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const buildItems = () =>
    groupedItems.map(({ product, quantity }) => ({
      id: product._id,
      quantity,
    }));

  const validateOrder = (): boolean => {
    if (!selectedAddress) {
      toast.error("Veuillez sélectionner une adresse de livraison.");
      return false;
    }
    return true;
  };

  const buildWhatsAppMessage = (): string => {
    const lines: string[] = [
      "🛒 *Nouvelle commande — Thiam Smart*",
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "🧾 *Produits commandés :*",
    ];

    groupedItems.forEach(({ product, quantity }) => {
      const unitPrice = product?.price as number;
      lines.push(
        `  • ${product?.name}`,
        `    ${quantity} × ${unitPrice.toLocaleString("fr-FR")} FCFA = *${(unitPrice * quantity).toLocaleString("fr-FR")} FCFA*`,
      );
    });

    lines.push(
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      `💰 *Total : ${getTotalPrice().toLocaleString("fr-FR")} FCFA*`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "📍 *Adresse de livraison :*",
    );

    if (selectedAddress) {
      const parts = [
        selectedAddress.name,
        selectedAddress.address,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.zip,
      ].filter(Boolean);
      lines.push(`  ${parts.join(", ")}`);
    }

    lines.push(
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "_Merci de confirmer la disponibilité et le délai de livraison_ 🙏",
    );

    return encodeURIComponent(lines.join("\n"));
  };

  /**
   * Ouvre WhatsApp dans un nouvel onglet.
   * Retourne false si le numéro n'est pas configuré.
   */
  const sendWhatsApp = (): boolean => {
    if (!WHATSAPP_NUMBER) {
      toast.error("Numéro WhatsApp non configuré.");
      toast.error("Le numéro WhatsApp n'est pas configuré sur le serveur.");
      return false;
    }

    // On s'assure que WHATSAPP_NUMBER ne contient que des chiffres
    const cleanedNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`,
      `https://wa.me/${cleanedNumber}?text=${buildWhatsAppMessage()}`,
      "_blank",
    );
    return true;
  };

  // ─── Vider le panier ─────────────────────────────────────────────────────
  const handleResetCart = () => {
    if (!window.confirm("Vider le panier ? Cette action est irréversible."))
      return;
    resetCart();
    toast.success("Panier vidé avec succès.");
  };

  // ─── Commander via WhatsApp ──────────────────────────────────────────────
  const handleCommander = async () => {
    if (!validateOrder()) return;

    setLoading((prev) => ({ ...prev, whatsapp: true }));
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildItems(),
          addressId: selectedAddress!._id,
          totalPrice: getTotalPrice(),
          paymentMethod: "whatsapp",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          errorData.error || "Erreur lors de la création de la commande.",
        );
        return;
      }

      if (!sendWhatsApp()) return;

      // FIX : on vide le panier uniquement après confirmation de l'envoi WhatsApp
      resetCart();
      window.location.href = "/success";
    } catch {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading((prev) => ({ ...prev, whatsapp: false }));
    }
  };

  // ─── Paiement Wave ───────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!validateOrder()) return;

    setLoading((prev) => ({ ...prev, wave: true }));
    try {
      // FIX 1 : on ne crée PAS la commande ici ; c'est le webhook Wave
      // (ou la page /success) qui doit confirmer la commande après paiement.
      // FIX 2 : on n'appelle PAS sendWhatsApp() — Wave n'est pas WhatsApp.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildItems(),
          addressId: selectedAddress!._id,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Erreur lors du paiement.");
        return;
      }

      const { checkoutUrl } = await res.json();

      // FIX 3 : on ne vide PAS le panier ici ; il sera vidé par le webhook
      // ou la page /success une fois le paiement Wave confirmé.
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading((prev) => ({ ...prev, wave: false }));
    }
  };

  // ─── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              {/* En-tête */}
              <div className="flex items-center gap-2.5 py-5">
                <ShoppingBag className="text-muted-foreground w-5 h-5" />
                <Title>Panier</Title>
                <span className="text-sm text-muted-foreground">
                  ({getItemCount()} article{getItemCount() > 1 ? "s" : ""})
                </span>
              </div>

              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* ── Liste des produits ── */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-900 border rounded-xl overflow-hidden">
                    {groupedItems.map(({ product, quantity }) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-4 p-4 border-b last:border-b-0"
                      >
                        {/* Image */}
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="shrink-0 rounded-lg overflow-hidden border group"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name ?? "Produit"}
                              width={96}
                              height={96}
                              loading="lazy"
                              className="w-20 h-20 md:w-24 md:h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </Link>
                        )}

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-medium line-clamp-1 mb-1">
                            {product?.name}
                          </h2>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="capitalize">
                              {product?.variant}
                            </span>
                            <span
                              className={`capitalize font-medium ${
                                product?.status === "En stock"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                            >
                              {product?.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <QuantityButtons product={product} />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <FavoriteButton
                                    showProduct
                                    product={product}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Ajouter aux favoris
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => {
                                      deleteCartProduct(product._id);
                                      toast.success("Produit supprimé.");
                                    }}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    aria-label="Supprimer le produit"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-red-600">
                                  Supprimer
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {/* Prix */}
                        <div className="text-right shrink-0">
                          <PriceFormatter
                            amount={(product.price as number) * quantity}
                            className="font-semibold text-base"
                          />
                          {quantity > 1 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {quantity} ×{" "}
                              {(product.price as number).toLocaleString(
                                "fr-FR",
                              )}{" "}
                              FCFA
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Vider le panier */}
                    <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetCart}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Vider le panier
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ── Sidebar ── */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Récapitulatif desktop */}
                  <div className="hidden md:block bg-white dark:bg-gray-900 border rounded-xl p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                      Récapitulatif
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <PriceFormatter amount={getTotalPrice()} />
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-baseline justify-between mb-5">
                      <span className="font-semibold">Total</span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="text-xl font-bold"
                      />
                    </div>
                    <ActionButtons
                      fullWidth
                      isProcessing={isProcessing}
                      loadingWhatsapp={loading.whatsapp}
                      loadingWave={loading.wave}
                      onCommander={handleCommander}
                      onCheckout={handleCheckout}
                    />
                  </div>

                  <AddressSection
                    loading={loading.addresses}
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onSelect={setSelectedAddress}
                    onAdd={() => setShowAddressModal(true)}
                  />
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}

      {/* ── Récapitulatif mobile fixe ── */}
      {isSignedIn && groupedItems?.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-t shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <PriceFormatter
                amount={getTotalPrice()}
                className="text-lg font-bold"
              />
            </div>
            <ActionButtons
              fullWidth
              isProcessing={isProcessing}
              loadingWhatsapp={loading.whatsapp}
              loadingWave={loading.wave}
              onCommander={handleCommander}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

      <AddAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={fetchAddresses}
      />
    </div>
  );
};

export default CartPage;
