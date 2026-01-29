"use client";

import { useCallback, useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export function useLocation() {
  const { location, setLocation, setLocationError, setLocationLoading } =
    useAppStore();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        setLocationError(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 minutes
      }
    );
  }, [setLocation, setLocationError, setLocationLoading]);

  // Request location on mount if we don't have one cached
  useEffect(() => {
    if (!location.coordinates && !location.error) {
      requestLocation();
    }
  }, [location.coordinates, location.error, requestLocation]);

  return {
    ...location,
    requestLocation,
  };
}
