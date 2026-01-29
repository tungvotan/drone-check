import type { Coordinates } from "@/types";

/**
 * Calculate sunrise and sunset times for a given location and date
 * Based on NOAA solar calculator algorithms
 */

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number; // minutes
}

export function calculateSunTimes(
  coords: Coordinates,
  date: Date = new Date()
): SunTimes {
  const { latitude, longitude } = coords;

  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Fractional year (radians)
  const gamma =
    ((2 * Math.PI) / 365) * (dayOfYear - 1 + (date.getHours() - 12) / 24);

  // Equation of time (minutes)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination (radians)
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Hour angle (degrees)
  const latRad = toRadians(latitude);
  const zenith = toRadians(90.833); // Official zenith for sunrise/sunset

  let ha = Math.acos(
    Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl)) -
      Math.tan(latRad) * Math.tan(decl)
  );
  ha = toDegrees(ha);

  // Calculate times
  const timeZoneOffset = -date.getTimezoneOffset() / 60;

  const solarNoonMinutes = 720 - 4 * longitude - eqTime + timeZoneOffset * 60;
  const sunriseMinutes = solarNoonMinutes - ha * 4;
  const sunsetMinutes = solarNoonMinutes + ha * 4;

  const baseDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const sunrise = new Date(baseDate.getTime() + sunriseMinutes * 60 * 1000);
  const sunset = new Date(baseDate.getTime() + sunsetMinutes * 60 * 1000);
  const solarNoon = new Date(baseDate.getTime() + solarNoonMinutes * 60 * 1000);

  const dayLength = sunsetMinutes - sunriseMinutes;

  return { sunrise, sunset, solarNoon, dayLength };
}

/**
 * Get minutes until sunset (negative if after sunset)
 */
export function getMinutesToSunset(coords: Coordinates, now: Date = new Date()): number {
  const { sunset } = calculateSunTimes(coords, now);
  return (sunset.getTime() - now.getTime()) / (1000 * 60);
}

/**
 * Get minutes since sunrise (negative if before sunrise)
 */
export function getMinutesSinceSunrise(coords: Coordinates, now: Date = new Date()): number {
  const { sunrise } = calculateSunTimes(coords, now);
  return (now.getTime() - sunrise.getTime()) / (1000 * 60);
}

/**
 * Check if it's currently daylight
 */
export function isDaylight(coords: Coordinates, now: Date = new Date()): boolean {
  const { sunrise, sunset } = calculateSunTimes(coords, now);
  return now >= sunrise && now <= sunset;
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
