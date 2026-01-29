import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coordinates, BeforeInstallPromptEvent } from "@/types";

interface LocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface AppState {
  // Location
  location: LocationState;
  setLocation: (coords: Coordinates) => void;
  setLocationError: (error: string) => void;
  setLocationLoading: (loading: boolean) => void;
  clearLocation: () => void;

  // Preferences
  darkMode: "system" | "light" | "dark";
  setDarkMode: (mode: "system" | "light" | "dark") => void;

  // Units
  units: "metric" | "imperial";
  setUnits: (units: "metric" | "imperial") => void;

  // Offline
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;

  // Install prompt
  installPrompt: BeforeInstallPromptEvent | null;
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Location
      location: {
        coordinates: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
      },
      setLocation: (coords) =>
        set({
          location: {
            coordinates: coords,
            isLoading: false,
            error: null,
            lastUpdated: new Date(),
          },
        }),
      setLocationError: (error) =>
        set((state) => ({
          location: {
            ...state.location,
            isLoading: false,
            error,
          },
        })),
      setLocationLoading: (loading) =>
        set((state) => ({
          location: {
            ...state.location,
            isLoading: loading,
          },
        })),
      clearLocation: () =>
        set({
          location: {
            coordinates: null,
            isLoading: false,
            error: null,
            lastUpdated: null,
          },
        }),

      // Preferences
      darkMode: "system",
      setDarkMode: (mode) => set({ darkMode: mode }),

      // Units
      units: "metric",
      setUnits: (units) => set({ units }),

      // Offline
      isOnline: true,
      setIsOnline: (online) => set({ isOnline: online }),

      // Install prompt
      installPrompt: null,
      setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
    }),
    {
      name: "drone-check-storage",
      partialize: (state) => ({
        location: state.location,
        darkMode: state.darkMode,
        units: state.units,
      }),
    }
  )
);
