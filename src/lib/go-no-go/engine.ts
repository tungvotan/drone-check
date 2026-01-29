import type {
  WeatherData,
  Coordinates,
  VerdictLevel,
  FactorResult,
  GoNoGoResult,
} from "@/types";
import { DEFAULT_THRESHOLDS, evaluateThreshold } from "./thresholds";

export interface EvaluationInput {
  weather: WeatherData;
  location: Coordinates;
  airspaceClass?: string;
  sunrise: string;
  sunset: string;
  checkTime?: Date;
}

/**
 * Evaluate all flight factors and return overall verdict
 * Uses worst-case (most restrictive) factor as overall verdict
 */
export function evaluateGoNoGo(input: EvaluationInput): GoNoGoResult {
  const factors: FactorResult[] = [];
  const now = input.checkTime || new Date();

  // 1. Wind Speed
  const windVerdict = evaluateThreshold(
    input.weather.windSpeed,
    DEFAULT_THRESHOLDS.wind
  );
  factors.push({
    name: "Wind Speed",
    value: input.weather.windSpeed,
    unit: "km/h",
    verdict: windVerdict,
    description: getWindDescription(input.weather.windSpeed),
  });

  // 2. Wind Gusts
  const gustVerdict = evaluateThreshold(
    input.weather.windGusts,
    DEFAULT_THRESHOLDS.gusts
  );
  factors.push({
    name: "Wind Gusts",
    value: input.weather.windGusts,
    unit: "km/h",
    verdict: gustVerdict,
    description: getGustDescription(input.weather.windGusts),
  });

  // 3. Visibility
  const visibilityVerdict = evaluateThreshold(
    input.weather.visibility,
    DEFAULT_THRESHOLDS.visibility,
    true // higher is better
  );
  factors.push({
    name: "Visibility",
    value: input.weather.visibility.toFixed(1),
    unit: "km",
    verdict: visibilityVerdict,
    description: getVisibilityDescription(input.weather.visibility),
  });

  // 4. Precipitation
  const precipVerdict = evaluatePrecipitation(
    input.weather.precipitationProbability,
    input.weather.isRaining
  );
  factors.push({
    name: "Precipitation",
    value: input.weather.isRaining
      ? "Raining"
      : `${input.weather.precipitationProbability}%`,
    unit: input.weather.isRaining ? "" : "chance",
    verdict: precipVerdict,
    description: getPrecipDescription(
      input.weather.precipitationProbability,
      input.weather.isRaining
    ),
  });

  // 5. Daylight
  const sunriseTime = new Date(input.sunrise);
  const sunsetTime = new Date(input.sunset);
  const minutesToSunset = (sunsetTime.getTime() - now.getTime()) / (1000 * 60);
  const isCurrentlyDaylight = now >= sunriseTime && now <= sunsetTime;
  const daylightVerdict = evaluateDaylightFromTimes(isCurrentlyDaylight, minutesToSunset);
  factors.push({
    name: "Daylight",
    value:
      minutesToSunset > 0
        ? `${Math.round(minutesToSunset)} min`
        : "After sunset",
    unit: minutesToSunset > 0 ? "to sunset" : "",
    verdict: daylightVerdict,
    description: getDaylightDescription(minutesToSunset),
  });

  // 6. Airspace
  const airspaceClass = input.airspaceClass || "G";
  const airspaceVerdict = evaluateAirspace(airspaceClass);
  factors.push({
    name: "Airspace",
    value: `Class ${airspaceClass}`,
    unit: "",
    verdict: airspaceVerdict,
    description: getAirspaceDescription(airspaceClass),
  });

  // Overall verdict is the worst case
  const overall = getWorstVerdict(factors.map((f) => f.verdict));

  return {
    overall,
    factors,
    timestamp: new Date(),
    location: input.location,
  };
}

/**
 * Get the most restrictive verdict from a list
 */
function getWorstVerdict(verdicts: VerdictLevel[]): VerdictLevel {
  if (verdicts.includes("nogo")) return "nogo";
  if (verdicts.includes("caution")) return "caution";
  return "go";
}

/**
 * Evaluate precipitation considering both probability and current state
 */
function evaluatePrecipitation(
  probability: number,
  isRaining: boolean
): VerdictLevel {
  if (isRaining) return "nogo";
  if (probability > 30) return "nogo";
  if (probability > 0) return "caution";
  return "go";
}

/**
 * Evaluate daylight conditions from pre-calculated times
 */
function evaluateDaylightFromTimes(isDaylight: boolean, minutesToSunset: number): VerdictLevel {
  if (!isDaylight) return "nogo";
  if (minutesToSunset < 0) return "nogo";
  if (minutesToSunset < 15) return "caution";
  if (minutesToSunset < 30) return "caution";
  return "go";
}

/**
 * Evaluate airspace class
 */
function evaluateAirspace(airspaceClass: string): VerdictLevel {
  const upper = airspaceClass.toUpperCase();
  if (upper === "G") return "go";
  if (upper === "E") return "caution";
  return "nogo"; // C, D, or restricted
}

// Description helpers
function getWindDescription(speed: number): string {
  if (speed < 10) return "Calm conditions, ideal for flying";
  if (speed < 20) return "Light wind, good flying conditions";
  if (speed < 35) return "Moderate wind, fly with caution";
  return "Strong wind, not recommended for flying";
}

function getGustDescription(gusts: number): string {
  if (gusts < 20) return "Minimal gusts, stable conditions";
  if (gusts < 30) return "Light gusts, manageable";
  if (gusts < 45) return "Moderate gusts, challenging conditions";
  return "Strong gusts, unsafe for flying";
}

function getVisibilityDescription(visibility: number): string {
  if (visibility >= 10) return "Excellent visibility";
  if (visibility >= 5) return "Good visibility, VLOS easily maintained";
  if (visibility >= 2) return "Reduced visibility, marginal for VLOS";
  return "Poor visibility, VLOS not possible";
}

function getPrecipDescription(probability: number, isRaining: boolean): string {
  if (isRaining) return "Currently raining, do not fly";
  if (probability === 0) return "No rain expected";
  if (probability <= 30) return "Low chance of rain, monitor conditions";
  return "High chance of rain, consider postponing";
}

function getDaylightDescription(minutesToSunset: number): string {
  if (minutesToSunset < 0) return "After sunset, night flying requires approval";
  if (minutesToSunset < 15) return "Sunset imminent, land soon";
  if (minutesToSunset < 30) return "Limited daylight remaining";
  if (minutesToSunset < 60) return "About an hour of daylight";
  return "Plenty of daylight remaining";
}

function getAirspaceDescription(airspaceClass: string): string {
  const upper = airspaceClass.toUpperCase();
  switch (upper) {
    case "G":
      return "Uncontrolled airspace, standard rules apply";
    case "E":
      return "Near controlled airspace boundary";
    case "D":
      return "Controlled airspace, ATC approval required";
    case "C":
      return "Controlled airspace, ATC approval required";
    default:
      return "Check local regulations";
  }
}
