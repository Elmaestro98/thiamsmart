"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Navigation, ShoppingBag } from "lucide-react";
import Link from "next/link";

export interface Boutique {
  id: number;
  nom: string;
  adresse: string;
  position: [number, number];
  telephone?: string;
  slug?: string;
}

const BOUTIQUES: Boutique[] = [
  {
    id: 1,
    nom: "Smart Technology",
    adresse: "Sedima, Keur Massar, Dakar 17000",
    position: [14.755871969413596, -17.28607266451278],
    telephone: "763853811",
  },
  {
    id: 2,
    nom: "Smart Technology",
    adresse: "CEM Pikine, Saint-Louis",
    position: [15.99496365275767, -16.48713929881789],
    telephone: "705664242",
  },
];

// Boutique telle que renvoyée par Sanity (position au format geopoint)
export interface SanityStore {
  _id: string;
  nom: string;
  slug?: string;
  adresse: string;
  telephone?: string;
  position: { lat: number; lng: number } | null;
}

interface MapProps {
  boutiques?: Boutique[];
  stores?: SanityStore[];
}

function storesToBoutiques(stores: SanityStore[]): Boutique[] {
  return stores
    .filter((store) => store.position)
    .map((store, index) => ({
      id: index,
      nom: store.nom,
      slug: store.slug,
      adresse: store.adresse,
      telephone: store.telephone,
      position: [store.position!.lat, store.position!.lng],
    }));
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Map({ boutiques, stores }: MapProps) {
  const resolvedBoutiques = useMemo<Boutique[]>(() => {
    if (stores && stores.length > 0) return storesToBoutiques(stores);
    if (boutiques && boutiques.length > 0) return boutiques;
    return BOUTIQUES;
  }, [boutiques, stores]);

  const center = useMemo<[number, number]>(() => {
    if (!resolvedBoutiques.length) return [14.7742082, -17.3163897];
    const lat =
      resolvedBoutiques.reduce((sum, b) => sum + b.position[0], 0) /
      resolvedBoutiques.length;
    const lng =
      resolvedBoutiques.reduce((sum, b) => sum + b.position[1], 0) /
      resolvedBoutiques.length;
    return [lat, lng];
  }, [resolvedBoutiques]);

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={6}
        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
        }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {resolvedBoutiques.map((boutique) => (
        <Marker
          key={boutique.id}
          position={boutique.position}
          icon={customIcon}
        >
          <Popup>
            <div className="p-1 min-w-[200px]">
              <h3 className="font-bold text-shop_dark_green text-lg mb-1">
                {boutique.nom}
              </h3>

              <div className="flex items-start gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4 text-shop_orange mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-tight">{boutique.adresse}</p>
              </div>

              {boutique.telephone && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Phone className="w-4 h-4 text-shop_orange flex-shrink-0" />
                  <a
                    href={`tel:${boutique.telephone}`}
                    className="text-sm hover:underline"
                  >
                    {boutique.telephone}
                  </a>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <a
                  href={`https://www.google.com/maps?q=${boutique.position[0]},${boutique.position[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-shop_orange text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors no-underline"
                >
                  <Navigation className="w-4 h-4" />
                  Itinéraire
                </a>

                {boutique.slug && (
                  <Link
                    href={`/boutique/${boutique.slug}`}
                    className="flex items-center justify-center gap-2 border border-shop_orange text-shop_orange px-3 py-2 rounded-lg text-sm font-semibold hover:bg-shop_orange hover:text-white transition-colors no-underline"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Voir les produits
                  </Link>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      </MapContainer>
    </div>
  );
}
