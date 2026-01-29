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
  airspaceClass: string = "G",
  checkTime?: Date
): Promise<GoNoGoResponse> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    airspace: airspaceClass,
  });

  if (checkTime) {
    params.append("time", checkTime.toISOString());
  }

  const response = await fetch(`/api/go-no-go?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to evaluate conditions");
  }
  return response.json();
}

export function useGoNoGo(
  latitude?: number,
  longitude?: number,
  airspaceClass: string = "G",
  checkTime?: Date
) {
  return useQuery({
    queryKey: ["go-no-go", latitude, longitude, airspaceClass, checkTime?.toISOString()],
    queryFn: () => fetchGoNoGo(latitude!, longitude!, airspaceClass, checkTime),
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}
