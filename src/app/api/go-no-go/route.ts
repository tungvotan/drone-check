import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather/api";
import { evaluateGoNoGo } from "@/lib/go-no-go/engine";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const airspaceClass = searchParams.get("airspace") || "G";
  const timeParam = searchParams.get("time");

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

    let weatherToEvaluate = weather.current;
    let checkTime: Date | undefined;

    if (timeParam) {
      checkTime = new Date(timeParam);
      // Find the closest hourly forecast
      const closestHour = weather.hourly.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.time).getTime() - checkTime!.getTime());
        const currDiff = Math.abs(new Date(curr.time).getTime() - checkTime!.getTime());
        return currDiff < prevDiff ? curr : prev;
      });

      // Use forecast data but adapt to WeatherData format
      weatherToEvaluate = {
        ...closestHour,
        // Ensure all required properties are present
        isRaining: closestHour.precipitationProbability > 50 || closestHour.weatherCode >= 51,
      };
    }

    const result = evaluateGoNoGo({
      weather: weatherToEvaluate,
      location: { latitude, longitude },
      airspaceClass,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
      checkTime,
    });

    return NextResponse.json({
      ...result,
      weather: weatherToEvaluate,
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
