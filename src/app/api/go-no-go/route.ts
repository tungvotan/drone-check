import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather/api";
import { evaluateGoNoGo } from "@/lib/go-no-go/engine";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const airspaceClass = searchParams.get("airspace") || "G";

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

  try {
    const weather = await fetchWeather(latitude, longitude);

    const result = evaluateGoNoGo({
      weather: weather.current,
      location: { latitude, longitude },
      airspaceClass,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
    });

    return NextResponse.json({
      ...result,
      weather: weather.current,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
    });
  } catch (error) {
    console.error("Go/No-Go evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate conditions" },
      { status: 500 }
    );
  }
}
