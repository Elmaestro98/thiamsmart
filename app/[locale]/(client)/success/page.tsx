"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import PriceView from "@/components/PriceView";
import AddAddressModal from "@/components/AddAddressModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { MessageCircle, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);

  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des adresses. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir réinitialiser votre panier ?",
    );
    if (confirmed) {
      resetCart();
      toast.success("Panier réinitialisé avec succès !");
    }
  };

  // ─── Construire le message WhatsApp ────────────────────────────────────────
  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("🛒 *Nouvelle commande*");
    lines.push("");
    lines.push("*Produits :*");

    groupedItems.forEach(({ product, quantity }) => {
      const total = (product?.price as number) * quantity;
      lines.push(
        `• ${product?.name} (x${quantity}) — ${total.toLocaleString("fr-FR")} FCFA`,
      );
    });

    lines.push("");
    lines.push(`*Total : ${getTotalPrice().toLocaleString("fr-FR")} FCFA*`);
    lines.push("");
    lines.push("*Adresse de livraison :*");

    if (selectedAddress) {
      lines.push(
        `${selectedAddress.name}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip}`,
      );
    }

    return encodeURIComponent(lines.join("\n"));
  };

  // ─── COMMANDER : WhatsApp uniquement ───────────────────────────────────────
  const handleCommander = async () => {
    if (!selectedAddress) {
      toast.error("Veuillez sélectionner une adresse de livraison");
      return;
    }

    setLoadingWhatsapp(true);

    try {
      const message = buildWhatsAppMessage();
      const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      toast.success("Commande envoyée sur WhatsApp !");
    } catch (error) {
      console.error("Erreur WhatsApp:", error);
      toast.error("Une erreur est survenue. Réessayer");
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  // ─── PASSER À LA CAISSE : API checkout (Wave) + WhatsApp ───────────────────
  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Veuillez sélectionner une adresse de livraison");
      return;
    }

    setLoading(true);

    try {
      // 1. Envoyer sur WhatsApp
      const message = buildWhatsAppMessage();
      const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

      // 2. Appel API checkout (validation stock + lien Wave)
      const items = groupedItems.map(({ product, quantity }) => ({
        id: product._id,
        quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, addressId: selectedAddress._id }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors du paiement.");
        return;
      }

      const { checkoutUrl } = await res.json();

      // 3. Redirection vers le lien de paiement Wave
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      toast.error("Une erreur est survenue. Réessayer");
    } finally {
      setLoading(false);
    }
  };

  // ─── Boutons réutilisables (desktop + mobile) ──────────────────────────────
  const ActionButtons = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <div className={`flex flex-col gap-3 ${fullWidth ? "w-full" : ""}`}>
      {/* Commander — WhatsApp uniquement */}
      <Button
        className={`rounded-full font-semibold tracking-wide hoverEffect bg-green-500 hover:bg-green-600 text-white ${fullWidth ? "w-full" : ""}`}
        size="lg"
        disabled={loadingWhatsapp || loading}
        onClick={handleCommander}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {loadingWhatsapp ? "Envoi en cours..." : "Commander via WhatsApp"}
      </Button>

      {/* Passer à la caisse — Wave + WhatsApp */}
      <Button
        className={`rounded-full font-semibold tracking-wide hoverEffect ${fullWidth ? "w-full" : ""}`}
        size="lg"
        disabled={loading || loadingWhatsapp}
        onClick={handleCheckout}
      >
        {loading ? "Veuillez patienter..." : "Passer à la caisse (Wave)"}
      </Button>
    </div>
  );

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Panier</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variante:{" "}
                                  <span className="font-semibold">
                                    {product?.variant}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Statut:{" "}
                                  <span className="font-semibold">
                                    {product?.status}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Ajouter aux favoris
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success(
                                            "Produit supprimé avec succès !",
                                          );
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Supprimer le produit
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Réinitialiser le panier
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="lg:col-span-1">
                    {/* Desktop order summary */}
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <div className="space-y-4">
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <ActionButtons fullWidth />
                      </div>
                    </div>

                    {/* Addresses */}
                    {addresses && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Adresse de livraison</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              defaultValue={addresses
                                ?.find((addr) => addr.default)
                                ?._id.toString()}
                            >
                              {addresses?.map((address) => (
                                <div
                                  key={address?._id}
                                  onClick={() => setSelectedAddress(address)}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                                    selectedAddress?._id === address?._id &&
                                    "text-shop_dark_green"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={address?._id.toString()}
                                  />
                                  <Label
                                    htmlFor={`address-${address?._id}`}
                                    className="grid gap-1.5 flex-1"
                                  >
                                    <span className="font-semibold">
                                      {address?.name}
                                    </span>
                                    <span className="text-sm text-black/60">
                                      {address.address}, {address.city},{" "}
                                      {address.state} {address.zip}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <Button
                              variant="outline"
                              className="w-full mt-4"
                              onClick={() => setShowAddressModal(true)}
                            >
                              Ajouter une nouvelle adresse
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile order summary */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2 className="capitalize mb-3">
                      Récapitulatif de la commande
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Sous-total</span>
                        <PriceView price={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Remise</span>
                        <PriceView
                          price={
                            getSubTotalPrice() > getTotalPrice()
                              ? getSubTotalPrice() - getTotalPrice()
                              : 0
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <ActionButtons fullWidth />
                    </div>
                  </div>
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

      <AddAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSuccess={fetchAddresses}
      />
    </div>
  );
};

export default CartPage;
