import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "weather-cache",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 15 * 60, // 15 minutes
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "mapbox-cache",
          expiration: {
            maxEntries: 128,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.openaip\.net\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "airspace-cache",
          expiration: {
            maxEntries: 256,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(), // Set correct root for turbopack
  },
};

export default withPWA(nextConfig);
