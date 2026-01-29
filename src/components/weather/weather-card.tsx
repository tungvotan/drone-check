"use client";

import type { WeatherData } from "@/types";
import { getWeatherDescription, getWeatherIcon } from "@/lib/weather/api";

interface WeatherCardProps {
  weather: WeatherData;
  sunrise: string;
  sunset: string;
  isLoading?: boolean;
}

export function WeatherCard({
  weather,
  sunrise,
  sunset,
  isLoading,
}: WeatherCardProps) {
  if (isLoading) {
    return <div className="h-40 rounded-2xl skeleton" />;
  }

  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  const isDay = now >= sunriseTime && now <= sunsetTime;

  return (
    <div className="bg-dark-elevated rounded-2xl p-5 border border-dark-border">
      {/* Main weather display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">
            {getWeatherIcon(weather.weatherCode, isDay)}
          </span>
          <div>
            <p className="text-4xl font-bold text-white">
              {Math.round(weather.temperature)}°
            </p>
            <p className="text-gray-400">
              {getWeatherDescription(weather.weatherCode)}
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-400">
          <p>Humidity {weather.humidity}%</p>
          <p>
            Vis {weather.visibility.toFixed(1)} km
          </p>
        </div>
      </div>

      {/* Wind info */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <div className="flex items-center gap-2">
          <WindIndicator direction={weather.windDirection} />
          <div>
            <p className="text-white font-medium">
              {Math.round(weather.windSpeed)} km/h
            </p>
            <p className="text-xs text-gray-500">
              Gusts {Math.round(weather.windGusts)} km/h
            </p>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <span>☀️</span>
            <span>
              {sunriseTime.toLocaleTimeString("en-AU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>🌙</span>
            <span>
              {sunsetTime.toLocaleTimeString("en-AU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WindIndicator({ direction }: { direction: number }) {
  return (
    <div
      className="w-10 h-10 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center"
      title={`Wind from ${direction}°`}
    >
      <svg
        className="w-6 h-6 text-drone-500"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ transform: `rotate(${direction + 180}deg)` }}
      >
        <path d="M12 2L4 20h16L12 2z" />
      </svg>
    </div>
  );
}
