"use client";

import Link from "next/link";
import type { Spot, VerdictLevel } from "@/types";

interface SpotCardProps {
  spot: Spot;
  verdict?: VerdictLevel;
  distance?: number;
}

const typeLabels: Record<string, string> = {
  maaa_club: "MAAA Club",
  community: "Community",
  park: "Park",
  field: "Field",
};

const typeColors: Record<string, string> = {
  maaa_club: "bg-drone-500/20 text-drone-400",
  community: "bg-blue-500/20 text-blue-400",
  park: "bg-green-500/20 text-green-400",
  field: "bg-amber-500/20 text-amber-400",
};

const verdictColors: Record<VerdictLevel, string> = {
  go: "bg-go text-white",
  caution: "bg-caution text-black",
  nogo: "bg-nogo text-white",
};

const amenityIcons: Record<string, string> = {
  parking: "🅿️",
  toilet: "🚻",
  shade: "⛱️",
  power: "🔌",
  water: "💧",
  seating: "🪑",
};

export function SpotCard({ spot, verdict, distance }: SpotCardProps) {
  return (
    <Link
      href={`/spots/${spot.slug}`}
      className="block bg-dark-elevated rounded-2xl p-4 border border-dark-border hover:border-drone-500/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name and type */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{spot.name}</h3>
            {verdict && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${verdictColors[verdict]}`}
              >
                {verdict.toUpperCase()}
              </span>
            )}
          </div>

          {/* Location and type */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${typeColors[spot.type]}`}>
              {typeLabels[spot.type]}
            </span>
            <span>{spot.state}</span>
            {distance !== undefined && (
              <span className="text-drone-400">
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
          </div>

          {/* Description */}
          {spot.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {spot.description}
            </p>
          )}

          {/* Amenities */}
          {spot.amenities.length > 0 && (
            <div className="flex gap-1">
              {spot.amenities.slice(0, 5).map((amenity) => (
                <span
                  key={amenity}
                  className="text-sm"
                  title={amenity}
                >
                  {amenityIcons[amenity] || "•"}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Airspace badge */}
        <div className="flex flex-col items-end gap-1">
          <span
            className={`
              px-2 py-1 rounded text-xs font-mono font-bold
              ${spot.airspaceClass === "G" ? "bg-go/20 text-go" : "bg-caution/20 text-caution"}
            `}
          >
            Class {spot.airspaceClass}
          </span>
          {spot.nearestAirportKm && (
            <span className="text-xs text-gray-500">
              ✈️ {spot.nearestAirportKm.toFixed(0)}km
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
