// Verdict types
export type VerdictLevel = "go" | "caution" | "nogo";

export interface FactorResult {
  name: string;
  value: number | string;
  unit: string;
  verdict: VerdictLevel;
  description: string;
}

export interface GoNoGoResult {
  overall: VerdictLevel;
  factors: FactorResult[];
  timestamp: Date;
  location: Coordinates;
}

// Weather types
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  visibility: number;
  precipitationProbability: number;
  isRaining: boolean;
  weatherCode: number;
  time: string;
}

export interface ForecastHour extends WeatherData {
  hour: number;
}

export interface WeatherResponse {
  current: WeatherData;
  hourly: ForecastHour[];
  sunrise: string;
  sunset: string;
  timezone: string;
}

// Location types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Spot types
export type SpotType = "maaa_club" | "community" | "park" | "field";
export type AmenityType = "parking" | "toilet" | "shade" | "power" | "water" | "seating";
export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export interface Spot {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  latitude: number;
  longitude: number;
  state: AustralianState;
  type: SpotType;
  nearestAirportKm: number | null;
  airspaceClass: string;
  amenities: AmenityType[];
  notes: string | null;
  sourceUrl: string | null;
  createdAt: string;
  // Computed fields
  distance?: number;
  weather?: WeatherData;
  verdict?: VerdictLevel;
}

export interface SpotFilters {
  state: AustralianState | null;
  type: SpotType | null;
  maxDistance: number | null;
  amenities: AmenityType[];
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  favoriteSpots: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: "system" | "light" | "dark";
  units: "metric" | "imperial";
  defaultLocation: Coordinates | null;
  windThreshold: number;
  gustThreshold: number;
}

// Favorite types
export interface Favorite {
  id: string;
  userId: string;
  spotId: string;
  createdAt: string;
}

// Rating types
export interface Rating {
  id: string;
  userId: string;
  spotId: string;
  score: number;
  comment: string | null;
  createdAt: string;
}

// App store types
export interface AppState {
  // Location
  location: LocationState;
  setLocation: (coords: Coordinates) => void;
  setLocationError: (error: string) => void;
  setLocationLoading: (loading: boolean) => void;

  // Preferences
  darkMode: "system" | "light" | "dark";
  setDarkMode: (mode: "system" | "light" | "dark") => void;

  // Offline
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Install prompt
  installPrompt: BeforeInstallPromptEvent | null;
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
}

// PWA types
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
