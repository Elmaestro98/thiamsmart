"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useAuth } from "@clerk/nextjs";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ChevronLeft,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Définition des étapes de commande — les valeurs de "status" doivent
// correspondre exactement à celles définies dans sanity/schemaTypes/orderTypes.ts
const ORDER_STATUS_STEPS = [
  { status: "En_Attente", label: "Commande reçue", icon: Clock },
  { status: "En_Traitement", label: "En préparation", icon: Package },
  { status: "En_cours", label: "En cours de livraison", icon: Truck },
  { status: "Livrée", label: "Livrée", icon: CheckCircle2 },
];

const OrderTrackingPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("orderId");
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !id) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const query = `*[_type == "order" && _id == $id && clerkUserId == $userId][0]{
          ...,
          products[]{
            ...,
            product->{
              name,
              images,
              price
            }
          }
        }`;
        const data = await client.fetch(query, { id, userId });
        setOrder(data);
      } catch (error) {
        console.error("Erreur tracking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, userId, isSignedIn]);

  if (loading) {
    return (
      <Container className="py-10">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold">Commande introuvable</h2>
        <p className="text-muted-foreground mt-2">
          Désolé, nous ne trouvons pas cette commande dans votre historique.
        </p>
        <Link
          href="/"
          className="text-shop_orange hover:underline mt-4 inline-block"
        >
          Retour à la boutique
        </Link>
      </Container>
    );
  }

  // Calcul de l'index de l'étape actuelle
  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(
    (s) => s.status === order.status,
  );
  const isCancelled = order.status === "Annulée";

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <Container className="py-8">
        {/* Retour et En-tête */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Commande #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Passée le{" "}
              {new Date(order.orderDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne Gauche : Stepper et Produits */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEPPER VISUEL (masqué si la commande est annulée) */}
            {isCancelled ? (
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 text-center text-red-600 font-medium">
                  Cette commande a été annulée.
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 sm:p-6 md:p-10">
                  <div className="relative flex justify-between items-center w-full">
                    {/* Ligne de progression en arrière-plan */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, currentStepIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />

                    {ORDER_STATUS_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div
                          key={step.status}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <div
                            className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                            ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"}
                            ${isCurrent ? "ring-4 ring-green-100" : ""}
                          `}
                          >
                            <Icon className="w-5 h-5 md:w-6 h-6" />
                          </div>
                          <span
                            className={`absolute -bottom-8 w-14 sm:w-auto text-center text-[9px] sm:text-[10px] md:text-xs font-medium leading-tight whitespace-normal sm:whitespace-nowrap ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ARTICLES */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Détails des articles</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.products?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border shrink-0">
                        {item.product?.images && (
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.product?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Qté : {item.quantity}
                        </p>
                      </div>
                      <PriceFormatter
                        amount={item.product?.price * item.quantity}
                        className="text-sm font-semibold"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50/50">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total payé</span>
                    <PriceFormatter
                      amount={order.totalPrice}
                      className="text-lg text-shop_orange"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne Droite : Infos Livraison & Support */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-shop_blue" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-semibold">{order.address?.name}</p>
                <p className="text-muted-foreground">
                  {order.address?.address}
                </p>
                <p className="text-muted-foreground">
                  {order.address?.city}, {order.address?.state}
                </p>
                <p className="text-muted-foreground">{order.address?.zip}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-shop_blue text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">Besoin d'aide ?</h3>
                </div>
                <p className="text-sm text-blue-100 mb-4">
                  Une question sur votre livraison ? Nos agents sont disponibles
                  pour vous répondre.
                </p>
                <a
                  href="tel:+221774714545"
                  className="block w-full py-2 bg-white text-shop_blue text-center rounded-lg font-bold hover:bg-blue-50 transition-colors"
                >
                  +221 77 471 45 45
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderTrackingPage;
