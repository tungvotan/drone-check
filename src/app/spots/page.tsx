"use client";

import { useState } from "react";
import { useSpots } from "@/hooks/use-spots";
import { SpotCard } from "@/components/spots/spot-card";
import { SpotFilters } from "@/components/spots/spot-filters";
import type { AustralianState, SpotType } from "@/types";

export default function SpotsPage() {
  const [filters, setFilters] = useState<{
    state: AustralianState | null;
    type: SpotType | null;
  }>({ state: null, type: null });

  const { data: spots = [], isLoading, error } = useSpots(
    filters.state || filters.type
      ? { state: filters.state, type: filters.type, maxDistance: null, amenities: [] }
      : undefined
  );

  const handleFilterChange = (newFilters: {
    state: AustralianState | null;
    type: SpotType | null;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">FPV Spots</h1>
        <p className="text-gray-400">
          {spots.length} curated flying locations across Australia
        </p>
      </div>

      {/* Filters */}
      <SpotFilters onFilterChange={handleFilterChange} />

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl skeleton" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Unable to load spots</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-drone-500 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      )}

      {/* Spots list */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {spots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No spots found matching your filters</p>
            </div>
          ) : (
            spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                distance={spot.distance}
              />
            ))
          )}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-8 p-4 bg-dark-elevated rounded-xl border border-dark-border">
        <p className="text-xs text-gray-500 text-center">
          📍 Data sourced from MAAA clubs and community contributions.
          Always verify local rules before flying.
        </p>
      </div>
    </div>
  );
}
