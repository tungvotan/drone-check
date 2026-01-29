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
