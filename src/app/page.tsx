"use client";

import { useState } from "react";
import { useLocation } from "@/hooks/use-location";
import { useGoNoGo } from "@/hooks/use-go-no-go";
import { useWeather } from "@/hooks/use-weather";
import { VerdictDisplay } from "@/components/go-no-go/verdict-display";
import { FactorBreakdown } from "@/components/go-no-go/factor-breakdown";
import { WeatherCard } from "@/components/weather/weather-card";
import { ForecastStrip } from "@/components/weather/forecast-strip";
import { FlightTimePicker } from "@/components/go-no-go/flight-time-picker";

export default function HomePage() {
  const { coordinates, isLoading: locationLoading, error: locationError } = useLocation();
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const {
    data: goNoGoData,
    isLoading: goNoGoLoading,
    error: goNoGoError,
  } = useGoNoGo(coordinates?.latitude, coordinates?.longitude, "G", selectedTime);

  const {
    data: weatherData,
    isLoading: weatherLoading,
  } = useWeather(coordinates?.latitude, coordinates?.longitude);

  // Loading state
  if (locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="w-16 h-16 rounded-full border-4 border-drone-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-gray-400">Getting your location...</p>
      </div>
    );
  }

  // Location error state
  if (locationError || !coordinates) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-dark-elevated flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Location Required</h2>
        <p className="text-gray-400 mb-6 max-w-xs">
          {locationError || "Enable location access to check flight conditions at your position."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-drone-500 text-white rounded-xl font-medium min-h-touch"
        >
          Try Again
        </button>
      </div>
    );
  }

  // API error state
  if (goNoGoError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-nogo/20 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-nogo"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Data</h2>
        <p className="text-gray-400 mb-6">Check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-drone-500 text-white rounded-xl font-medium min-h-touch"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Flight Time Picker */}
      <FlightTimePicker selectedTime={selectedTime} onTimeChange={setSelectedTime} />

      {/* Verdict Display */}
      <VerdictDisplay
        verdict={goNoGoData?.overall || "go"}
        isLoading={goNoGoLoading}
      />

      {/* Weather Card */}
      {goNoGoData && (
        <WeatherCard
          weather={goNoGoData.weather}
          sunrise={goNoGoData.sunrise}
          sunset={goNoGoData.sunset}
          isLoading={goNoGoLoading}
        />
      )}

      {/* Hourly Forecast */}
      {weatherData && (
        <ForecastStrip
          hourly={weatherData.hourly}
          sunrise={weatherData.sunrise}
          sunset={weatherData.sunset}
          isLoading={weatherLoading}
        />
      )}

      {/* Factor Breakdown */}
      {goNoGoData && <FactorBreakdown factors={goNoGoData.factors} />}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-dark-elevated rounded-xl border border-dark-border">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ This app provides guidance only. Always check NOTAMs, local regulations,
          and use your own judgment before flying. Not for commercial operations.
        </p>
      </div>
    </div>
  );
}
