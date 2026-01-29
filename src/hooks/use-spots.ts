"use client";

import { useQuery } from "@tanstack/react-query";
import { getSpots, getSpotBySlug, getNearbySpots } from "@/lib/spots/queries";
import type { SpotFilters } from "@/types";

export function useSpots(filters?: SpotFilters) {
  return useQuery({
    queryKey: ["spots", filters],
    queryFn: () => getSpots(filters),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function useSpot(slug: string) {
  return useQuery({
    queryKey: ["spot", slug],
    queryFn: () => getSpotBySlug(slug),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useNearbySpots(
  latitude?: number,
  longitude?: number,
  radiusKm: number = 100
) {
  return useQuery({
    queryKey: ["nearby-spots", latitude, longitude, radiusKm],
    queryFn: () => getNearbySpots(latitude!, longitude!, radiusKm),
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
