"use client";

import type { VerdictLevel } from "@/types";

interface VerdictDisplayProps {
  verdict: VerdictLevel;
  isLoading?: boolean;
}

const verdictConfig = {
  go: {
    label: "GO",
    bgClass: "bg-go",
    textClass: "text-go",
    shadowClass: "shadow-glow-go",
    description: "Conditions are good for flying",
  },
  caution: {
    label: "CAUTION",
    bgClass: "bg-caution",
    textClass: "text-caution",
    shadowClass: "shadow-glow-caution",
    description: "Fly with extra care",
  },
  nogo: {
    label: "NO-GO",
    bgClass: "bg-nogo",
    textClass: "text-nogo",
    shadowClass: "shadow-glow-nogo",
    description: "Do not fly",
  },
};

export function VerdictDisplay({ verdict, isLoading }: VerdictDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-48 h-48 rounded-full skeleton" />
        <div className="mt-4 w-32 h-6 skeleton rounded" />
      </div>
    );
  }

  const config = verdictConfig[verdict];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Main verdict circle */}
      <div
        className={`
          relative w-48 h-48 rounded-full flex items-center justify-center
          ${config.bgClass} ${config.shadowClass}
          ${verdict === "go" ? "verdict-go" : ""}
        `}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-full bg-dark-bg/20" />

        {/* Verdict text */}
        <span className="relative text-verdict-lg font-extrabold text-white outdoor-text">
          {config.label}
        </span>
      </div>

      {/* Description */}
      <p className={`mt-4 text-lg font-medium ${config.textClass}`}>
        {config.description}
      </p>

      {/* Last updated */}
      <p className="mt-2 text-sm text-gray-500">
        Updated {new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
