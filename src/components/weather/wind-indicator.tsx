"use client";

interface WindIndicatorProps {
  direction: number;
  speed: number;
  gusts?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function WindIndicator({
  direction,
  speed,
  gusts,
  size = "md",
}: WindIndicatorProps) {
  // Determine color based on speed
  const getColor = () => {
    if (speed >= 35) return "text-nogo";
    if (speed >= 20) return "text-caution";
    return "text-go";
  };

  // Cardinal direction label
  const getCardinal = (deg: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Wind compass */}
      <div
        className={`
          ${sizeClasses[size]} rounded-full
          bg-dark-surface border border-dark-border
          flex items-center justify-center
        `}
        title={`Wind from ${getCardinal(direction)} (${direction}°)`}
      >
        <svg
          className={`${iconSizes[size]} ${getColor()}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ transform: `rotate(${direction + 180}deg)` }}
        >
          <path d="M12 2L4 20h16L12 2z" />
        </svg>
      </div>

      {/* Speed label */}
      <div className="text-center">
        <p className={`font-mono font-bold ${getColor()}`}>
          {Math.round(speed)}
        </p>
        <p className="text-xs text-gray-500">km/h</p>
      </div>

      {/* Gusts if provided */}
      {gusts !== undefined && gusts > speed && (
        <p className="text-xs text-gray-400">
          ↑{Math.round(gusts)}
        </p>
      )}
    </div>
  );
}
