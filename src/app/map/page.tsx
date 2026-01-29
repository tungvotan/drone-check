"use client";

import dynamic from "next/dynamic";
import { useLocation } from "@/hooks/use-location";
import { useSpots } from "@/hooks/use-spots";
import { useRouter } from "next/navigation";
import type { Spot } from "@/types";

// Dynamic import for map to avoid SSR issues
const DroneMap = dynamic(() => import("@/components/map/drone-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-elevated">
      <div className="w-12 h-12 rounded-full border-4 border-drone-500 border-t-transparent animate-spin" />
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();
  const { coordinates } = useLocation();
  const { data: spots = [], isLoading } = useSpots();

  const handleSpotClick = (spot: Spot) => {
    router.push(`/spots/${spot.slug}`);
  };

  return (
    <div className="fixed inset-0 pt-14 pb-16">
      <DroneMap
        spots={spots}
        onSpotClick={handleSpotClick}
        initialCenter={coordinates || undefined}
        showAirspace={true}
      />

      {/* Legend */}
      <div className="absolute bottom-20 left-4 right-4 bg-dark-bg/90 backdrop-blur-sm rounded-xl p-3 border border-dark-border">
        <div className="flex flex-wrap gap-4 text-xs">
          <LegendItem color="bg-drone-500" label="MAAA Club" />
          <LegendItem color="bg-blue-500" label="Community" />
          <LegendItem color="bg-green-500" label="Park" />
          <LegendItem color="bg-amber-500" label="Field" />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tap a marker to view spot details
        </p>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-dark-bg/90 backdrop-blur-sm rounded-full px-4 py-2 border border-dark-border">
          <p className="text-sm text-gray-400">Loading spots...</p>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
