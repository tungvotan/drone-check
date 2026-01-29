import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing latitude or longitude" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude" },
      { status: 400 }
    );
  }

  // Validate coordinates are within Australia roughly
  if (latitude < -45 || latitude > -10 || longitude < 110 || longitude > 155) {
    return NextResponse.json(
      { error: "Coordinates must be within Australia" },
      { status: 400 }
    );
  }

  try {
    const weather = await fetchWeather(latitude, longitude);
    return NextResponse.json(weather);
  } catch (error) {
    console.error("Weather fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
