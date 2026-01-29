import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");
  const type = searchParams.get("type");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");

  try {
    const supabase = await createClient();

    // If coordinates provided, use nearby_spots function
    if (lat && lng) {
      const { data, error } = await supabase.rpc("nearby_spots", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius_km: radius ? parseFloat(radius) : 100,
      });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // Otherwise, fetch with filters
    let query = supabase.from("spots").select("*").order("name");

    if (state) {
      query = query.eq("state", state);
    }

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Spots fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}
