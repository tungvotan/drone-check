"use client";

import type { ForecastHour } from "@/types";
import { getWeatherIcon } from "@/lib/weather/api";

interface ForecastStripProps {
  hourly: ForecastHour[];
  sunrise: string;
  sunset: string;
  isLoading?: boolean;
}

export function ForecastStrip({
  hourly,
  sunrise,
  sunset,
  isLoading,
}: ForecastStripProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-16 h-24 rounded-xl skeleton" />
        ))}
      </div>
    );
  }

  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  const now = new Date();

  // Filter to show next 12 hours starting from current hour
  const currentHour = now.getHours();
  const upcomingHours = hourly.filter((h) => h.hour >= currentHour).slice(0, 12);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 px-1">Hourly Forecast</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {upcomingHours.map((hour) => {
          const hourDate = new Date(hour.time);
          const isDay = hourDate >= sunriseTime && hourDate <= sunsetTime;
          const isNow = hour.hour === currentHour;

          // Determine wind status color
          const getWindColor = () => {
            if (hour.windSpeed >= 35) return "text-nogo";
            if (hour.windSpeed >= 20) return "text-caution";
            return "text-go";
          };

          return (
            <div
              key={hour.hour}
              className={`
                flex-shrink-0 w-16 rounded-xl p-2
                ${isNow ? "bg-drone-500/20 border border-drone-500/50" : "bg-dark-elevated border border-dark-border"}
                flex flex-col items-center gap-1
              `}
            >
              {/* Hour */}
              <p className={`text-xs font-medium ${isNow ? "text-drone-400" : "text-gray-400"}`}>
                {isNow ? "Now" : `${hour.hour}:00`}
              </p>

              {/* Weather icon */}
              <span className="text-xl">
                {getWeatherIcon(hour.weatherCode, isDay)}
              </span>

              {/* Temperature */}
              <p className="text-sm font-semibold text-white">
                {Math.round(hour.temperature)}°
              </p>

              {/* Wind speed */}
              <p className={`text-xs font-mono ${getWindColor()}`}>
                {Math.round(hour.windSpeed)}
              </p>

              {/* Rain probability if > 0 */}
              {hour.precipitationProbability > 0 && (
                <p className="text-xs text-blue-400">
                  💧{hour.precipitationProbability}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
