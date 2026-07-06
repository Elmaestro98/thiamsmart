"use client";

import dynamic from "next/dynamic";
import type { SanityStore } from "@/components/Map";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl text-gray-500 text-sm">
      Chargement de la carte...
    </div>
  ),
});

interface MapLoaderProps {
  stores?: SanityStore[];
}

export default function MapLoader({ stores }: MapLoaderProps) {
  return <Map stores={stores} />;
}
