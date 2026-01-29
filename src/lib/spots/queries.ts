import { createClient } from "@/lib/supabase/client";
import type { Spot, SpotFilters, AmenityType } from "@/types";

export async function getSpots(filters?: SpotFilters): Promise<Spot[]> {
  const supabase = createClient();

  let query = supabase
    .from("spots")
    .select("*")
    .order("name");

  if (filters?.state) {
    query = query.eq("state", filters.state);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching spots:", error);
    throw error;
  }

  return (data || []).map(transformSpot);
}

export async function getSpotBySlug(slug: string): Promise<Spot | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching spot:", error);
    throw error;
  }

  return data ? transformSpot(data) : null;
}

export async function getNearbySpots(
  latitude: number,
  longitude: number,
  radiusKm: number = 100
): Promise<Spot[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("nearby_spots", {
    lat: latitude,
    lng: longitude,
    radius_km: radiusKm,
  });

  if (error) {
    console.error("Error fetching nearby spots:", error);
    throw error;
  }

  return (data || []).map((spot: Record<string, unknown>) => ({
    ...transformSpot(spot),
    distance: spot.distance_km as number,
  }));
}

// Transform database snake_case to camelCase
function transformSpot(data: Record<string, unknown>): Spot {
  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    description: data.description as string | null,
    latitude: data.latitude as number,
    longitude: data.longitude as number,
    state: data.state as Spot["state"],
    type: data.type as Spot["type"],
    nearestAirportKm: data.nearest_airport_km as number | null,
    airspaceClass: data.airspace_class as string,
    amenities: (data.amenities as AmenityType[]) || [],
    notes: data.notes as string | null,
    sourceUrl: data.source_url as string | null,
    createdAt: data.created_at as string,
  };
}
