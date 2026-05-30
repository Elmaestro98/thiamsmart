"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Navigation } from "lucide-react";

export interface Boutique {
  id: number;
  nom: string;
  adresse: string;
  position: [number, number];
  telephone?: string;
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

interface MapProps {
  boutiques?: Boutique[];
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Map({ boutiques = BOUTIQUES }: MapProps) {
  const center = useMemo<[number, number]>(() => {
    if (!boutiques.length) return [14.7742082, -17.3163897];
    const lat =
      boutiques.reduce((sum, b) => sum + b.position[0], 0) / boutiques.length;
    const lng =
      boutiques.reduce((sum, b) => sum + b.position[1], 0) / boutiques.length;
    return [lat, lng];
  }, [boutiques]);

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        zIndex: 0,
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {boutiques.map((boutique) => (
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

              <a
                href={`https://www.google.com/maps?q=${boutique.position[0]},${boutique.position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-shop_orange text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors no-underline"
              >
                <Navigation className="w-4 h-4" />
                Itinéraire
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
