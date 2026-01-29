"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherResponse } from "@/types";

async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const response = await fetch(
    `/api/weather?lat=${latitude}&lng=${longitude}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }
  return response.json();
}

export function useWeather(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: () => fetchWeather(latitude!, longitude!),
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
