"use client";

import { useQuery } from "@tanstack/react-query";
import type { GoNoGoResult, WeatherData } from "@/types";

interface GoNoGoResponse extends GoNoGoResult {
  weather: WeatherData;
  sunrise: string;
  sunset: string;
}

async function fetchGoNoGo(
  latitude: number,
  longitude: number,
  airspaceClass: string = "G"
): Promise<GoNoGoResponse> {
  const response = await fetch(
    `/api/go-no-go?lat=${latitude}&lng=${longitude}&airspace=${airspaceClass}`
  );
  if (!response.ok) {
    throw new Error("Failed to evaluate conditions");
  }
  return response.json();
}

export function useGoNoGo(
  latitude?: number,
  longitude?: number,
  airspaceClass: string = "G"
) {
  return useQuery({
    queryKey: ["go-no-go", latitude, longitude, airspaceClass],
    queryFn: () => fetchGoNoGo(latitude!, longitude!, airspaceClass),
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}
