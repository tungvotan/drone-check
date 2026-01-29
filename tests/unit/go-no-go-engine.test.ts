import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { evaluateGoNoGo } from "@/lib/go-no-go/engine";
import type { WeatherData, Coordinates } from "@/types";

const baseLocation: Coordinates = {
  latitude: -33.8688,
  longitude: 151.2093, // Sydney
};

const baseWeather: WeatherData = {
  temperature: 22,
  humidity: 50,
  windSpeed: 10,
  windGusts: 15,
  windDirection: 180,
  visibility: 10,
  precipitationProbability: 0,
  isRaining: false,
  weatherCode: 0,
  time: "2024-01-15T12:00:00.000Z",
};

// Fixed noon time for testing
const MOCK_NOON = new Date("2024-01-15T12:00:00.000Z");
const MOCK_SUNRISE = new Date("2024-01-15T06:00:00.000Z");
const MOCK_SUNSET = new Date("2024-01-15T18:00:00.000Z");

describe("Go/No-Go Engine", () => {
  beforeEach(() => {
    // Mock Date to return noon
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_NOON);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Overall verdict", () => {
    it("returns GO for ideal conditions", () => {
      const result = evaluateGoNoGo({
        weather: baseWeather,
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("go");
      expect(result.factors.length).toBe(6);
    });

    it("returns NOGO for high wind speed", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, windSpeed: 40 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
    });

    it("returns NOGO for high gusts", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, windGusts: 50 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
    });

    it("returns NOGO for active rain", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, isRaining: true },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
    });

    it("returns NOGO for poor visibility", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, visibility: 1 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
    });

    it("returns NOGO for controlled airspace", () => {
      const result = evaluateGoNoGo({
        weather: baseWeather,
        location: baseLocation,
        airspaceClass: "C",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
    });

    it("returns CAUTION for moderate wind", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, windSpeed: 25 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("caution");
    });

    it("returns CAUTION for low precipitation probability", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, precipitationProbability: 20 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("caution");
    });

    it("returns CAUTION for Class E airspace", () => {
      const result = evaluateGoNoGo({
        weather: baseWeather,
        location: baseLocation,
        airspaceClass: "E",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("caution");
    });
  });

  describe("Individual factors", () => {
    it("evaluates wind speed correctly", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, windSpeed: 15 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      const windFactor = result.factors.find((f) => f.name === "Wind Speed");
      expect(windFactor).toBeDefined();
      expect(windFactor?.verdict).toBe("go");
      expect(windFactor?.value).toBe(15);
    });

    it("evaluates visibility correctly", () => {
      const result = evaluateGoNoGo({
        weather: { ...baseWeather, visibility: 3 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      const visFactor = result.factors.find((f) => f.name === "Visibility");
      expect(visFactor).toBeDefined();
      expect(visFactor?.verdict).toBe("caution");
    });

    it("includes all 6 factors", () => {
      const result = evaluateGoNoGo({
        weather: baseWeather,
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.factors.map((f) => f.name)).toEqual([
        "Wind Speed",
        "Wind Gusts",
        "Visibility",
        "Precipitation",
        "Daylight",
        "Airspace",
      ]);
    });
  });

  describe("Edge cases", () => {
    it("handles zero values", () => {
      const result = evaluateGoNoGo({
        weather: {
          ...baseWeather,
          windSpeed: 0,
          windGusts: 0,
          precipitationProbability: 0,
        },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("go");
    });

    it("handles threshold boundary values", () => {
      // Wind at exactly 19.9 km/h should be GO (< 20 is GO)
      const result20 = evaluateGoNoGo({
        weather: { ...baseWeather, windSpeed: 19.9 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });
      const windFactor20 = result20.factors.find((f) => f.name === "Wind Speed");
      expect(windFactor20?.verdict).toBe("go");

      // Wind at 20 km/h should be CAUTION
      const result21 = evaluateGoNoGo({
        weather: { ...baseWeather, windSpeed: 20 },
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });
      const windFactor21 = result21.factors.find((f) => f.name === "Wind Speed");
      expect(windFactor21?.verdict).toBe("caution");
    });

    it("returns NOGO after sunset", () => {
      // Set time to after sunset
      vi.setSystemTime(new Date("2024-01-15T19:00:00.000Z"));

      const result = evaluateGoNoGo({
        weather: baseWeather,
        location: baseLocation,
        airspaceClass: "G",
        sunrise: MOCK_SUNRISE.toISOString(),
        sunset: MOCK_SUNSET.toISOString(),
      });

      expect(result.overall).toBe("nogo");
      const daylightFactor = result.factors.find((f) => f.name === "Daylight");
      expect(daylightFactor?.verdict).toBe("nogo");
    });
  });
});
