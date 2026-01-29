"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSpot } from "@/hooks/use-spots";
import { useGoNoGo } from "@/hooks/use-go-no-go";
import { VerdictDisplay } from "@/components/go-no-go/verdict-display";
import { WeatherCard } from "@/components/weather/weather-card";
import { FactorBreakdown } from "@/components/go-no-go/factor-breakdown";

// Dynamic import for map
const DroneMap = dynamic(() => import("@/components/map/drone-map"), {
  ssr: false,
  loading: () => <div className="h-48 skeleton rounded-xl" />,
});

const typeLabels: Record<string, string> = {
  maaa_club: "MAAA Club",
  community: "Community Spot",
  park: "Park",
  field: "Open Field",
};

const amenityLabels: Record<string, { icon: string; label: string }> = {
  parking: { icon: "🅿️", label: "Parking" },
  toilet: { icon: "🚻", label: "Toilets" },
  shade: { icon: "⛱️", label: "Shade" },
  power: { icon: "🔌", label: "Power" },
  water: { icon: "💧", label: "Water" },
  seating: { icon: "🪑", label: "Seating" },
};

export default function SpotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: spot, isLoading: spotLoading, error: spotError } = useSpot(slug);

  const {
    data: goNoGoData,
    isLoading: goNoGoLoading,
  } = useGoNoGo(
    spot?.latitude,
    spot?.longitude,
    spot?.airspaceClass
  );

  if (spotLoading) {
    return (
      <div className="px-4 py-6 space-y-4">
        <div className="h-48 skeleton rounded-xl" />
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-32 skeleton rounded-xl" />
      </div>
    );
  }

  if (spotError || !spot) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Spot Not Found</h2>
        <p className="text-gray-400 mb-6">This flying spot doesn&apos;t exist or has been removed.</p>
        <Link
          href="/spots"
          className="px-6 py-3 bg-drone-500 text-white rounded-xl font-medium"
        >
          Browse All Spots
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Mini map */}
      <div className="h-48 w-full">
        <DroneMap
          spots={[spot]}
          initialCenter={{ latitude: spot.latitude, longitude: spot.longitude }}
          showAirspace={true}
        />
      </div>

      <div className="px-4 -mt-6 relative z-10 space-y-6">
        {/* Header card */}
        <div className="bg-dark-elevated rounded-2xl p-5 border border-dark-border shadow-lg">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl font-bold text-white">{spot.name}</h1>
              <p className="text-sm text-gray-400">
                {typeLabels[spot.type]} • {spot.state}
              </p>
            </div>
            <span
              className={`
                px-3 py-1 rounded-lg text-sm font-mono font-bold
                ${spot.airspaceClass === "G" ? "bg-go/20 text-go" : "bg-caution/20 text-caution"}
              `}
            >
              Class {spot.airspaceClass}
            </span>
          </div>

          {spot.description && (
            <p className="text-gray-300 mb-4">{spot.description}</p>
          )}

          {/* Amenities */}
          {spot.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {spot.amenities.map((amenity) => {
                const info = amenityLabels[amenity];
                return (
                  <span
                    key={amenity}
                    className="flex items-center gap-1 px-3 py-1 bg-dark-surface rounded-full text-sm"
                  >
                    <span>{info?.icon || "•"}</span>
                    <span className="text-gray-400">{info?.label || amenity}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Airport distance */}
          {spot.nearestAirportKm && (
            <p className="mt-3 text-sm text-gray-500">
              ✈️ Nearest airport: {spot.nearestAirportKm.toFixed(0)} km away
            </p>
          )}

          {/* Notes */}
          {spot.notes && (
            <div className="mt-4 p-3 bg-dark-surface rounded-xl">
              <p className="text-sm text-gray-400">
                💡 {spot.notes}
              </p>
            </div>
          )}
        </div>

        {/* Current conditions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Current Conditions</h2>
          <VerdictDisplay
            verdict={goNoGoData?.overall || "go"}
            isLoading={goNoGoLoading}
          />
        </div>

        {/* Weather */}
        {goNoGoData && (
          <WeatherCard
            weather={goNoGoData.weather}
            sunrise={goNoGoData.sunrise}
            sunset={goNoGoData.sunset}
          />
        )}

        {/* Factors */}
        {goNoGoData && <FactorBreakdown factors={goNoGoData.factors} />}

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-drone-500 text-white rounded-xl font-medium min-h-touch"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Navigate
          </a>
          <button
            className="px-4 py-3 bg-dark-elevated text-gray-400 rounded-xl border border-dark-border min-h-touch"
            title="Add to favorites (sign in required)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Source link */}
        {spot.sourceUrl && (
          <a
            href={spot.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-drone-400 hover:underline"
          >
            View source →
          </a>
        )}
      </div>
    </div>
  );
}
