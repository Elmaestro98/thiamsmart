"use client";

import dynamic from "next/dynamic";

const MapLoader = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl text-gray-500 text-sm">
      Chargement de la carte...
    </div>
  ),
});

export default MapLoader;
