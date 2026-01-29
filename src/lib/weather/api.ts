import type { WeatherData, ForecastHour, WeatherResponse } from "@/types";

export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    wind_direction_10m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    visibility: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
  timezone: string;
}

const OPEN_METEO_BOM_URL = "https://api.open-meteo.com/v1/bom";

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_gusts_10m",
      "wind_direction_10m",
      "weather_code",
      "precipitation",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_gusts_10m",
      "wind_direction_10m",
      "weather_code",
      "precipitation_probability",
      "visibility",
    ].join(","),
    daily: "sunrise,sunset",
    timezone: "auto",
    forecast_days: "1",
  });

  const response = await fetch(`${OPEN_METEO_BOM_URL}?${params}`, {
    next: { revalidate: 900 }, // 15 minutes
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();
  return transformResponse(data);
}

function transformResponse(data: OpenMeteoResponse): WeatherResponse {
  const current: WeatherData = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGusts: data.current.wind_gusts_10m,
    windDirection: data.current.wind_direction_10m,
    visibility: data.hourly.visibility[0] / 1000, // Convert m to km
    precipitationProbability: data.hourly.precipitation_probability[0],
    isRaining: data.current.precipitation > 0,
    weatherCode: data.current.weather_code,
    time: data.current.time,
  };

  const hourly: ForecastHour[] = data.hourly.time
    .slice(0, 24)
    .map((time, i) => ({
      temperature: data.hourly.temperature_2m[i],
      humidity: data.hourly.relative_humidity_2m[i],
      windSpeed: data.hourly.wind_speed_10m[i],
      windGusts: data.hourly.wind_gusts_10m[i],
      windDirection: data.hourly.wind_direction_10m[i],
      visibility: data.hourly.visibility[i] / 1000,
      precipitationProbability: data.hourly.precipitation_probability[i],
      isRaining: false,
      weatherCode: data.hourly.weather_code[i],
      time,
      hour: new Date(time).getHours(),
    }));

  return {
    current,
    hourly,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    timezone: data.timezone,
  };
}

// Weather code descriptions (WMO codes)
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
}

// Get weather icon based on code and time
export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0 || code === 1) return isDay ? "☀️" : "🌙";
  if (code === 2) return isDay ? "⛅" : "☁️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌧️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}
