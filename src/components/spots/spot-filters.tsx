"use client";

import { useState } from "react";
import type { AustralianState, SpotType } from "@/types";

interface SpotFiltersProps {
  onFilterChange: (filters: {
    state: AustralianState | null;
    type: SpotType | null;
  }) => void;
}

const states: { value: AustralianState | null; label: string }[] = [
  { value: null, label: "All States" },
  { value: "NSW", label: "NSW" },
  { value: "VIC", label: "VIC" },
  { value: "QLD", label: "QLD" },
  { value: "WA", label: "WA" },
  { value: "SA", label: "SA" },
  { value: "TAS", label: "TAS" },
  { value: "NT", label: "NT" },
  { value: "ACT", label: "ACT" },
];

const types: { value: SpotType | null; label: string }[] = [
  { value: null, label: "All Types" },
  { value: "maaa_club", label: "MAAA Clubs" },
  { value: "community", label: "Community" },
  { value: "park", label: "Parks" },
  { value: "field", label: "Fields" },
];

export function SpotFilters({ onFilterChange }: SpotFiltersProps) {
  const [selectedState, setSelectedState] = useState<AustralianState | null>(null);
  const [selectedType, setSelectedType] = useState<SpotType | null>(null);

  const handleStateChange = (state: AustralianState | null) => {
    setSelectedState(state);
    onFilterChange({ state, type: selectedType });
  };

  const handleTypeChange = (type: SpotType | null) => {
    setSelectedType(type);
    onFilterChange({ state: selectedState, type });
  };

  return (
    <div className="space-y-3">
      {/* State filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {states.map((state) => (
          <button
            key={state.value || "all"}
            onClick={() => handleStateChange(state.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              transition-colors min-h-touch
              ${
                selectedState === state.value
                  ? "bg-drone-500 text-white"
                  : "bg-dark-elevated text-gray-400 border border-dark-border"
              }
            `}
          >
            {state.label}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {types.map((type) => (
          <button
            key={type.value || "all"}
            onClick={() => handleTypeChange(type.value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              transition-colors min-h-touch
              ${
                selectedType === type.value
                  ? "bg-drone-500 text-white"
                  : "bg-dark-elevated text-gray-400 border border-dark-border"
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
