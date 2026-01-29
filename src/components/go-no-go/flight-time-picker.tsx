"use client";

import { useState } from "react";

interface FlightTimePickerProps {
  selectedTime: Date;
  onTimeChange: (time: Date) => void;
}

export function FlightTimePicker({ selectedTime, onTimeChange }: FlightTimePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate next 24 hours in 1-hour increments
  const getTimeOptions = () => {
    const options: Date[] = [];
    const now = new Date();
    now.setMinutes(0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      options.push(time);
    }
    return options;
  };

  const timeOptions = getTimeOptions();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric" });
  };

  const isNow = (date: Date) => {
    const now = new Date();
    return Math.abs(date.getTime() - now.getTime()) < 60 * 60 * 1000;
  };

  const isDaytime = (date: Date) => {
    const hour = date.getHours();
    return hour >= 6 && hour <= 18;
  };

  return (
    <div className="space-y-2">
      {/* Current selection button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-dark-elevated rounded-xl border border-dark-border"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isDaytime(selectedTime) ? "☀️" : "🌙"}</span>
          <div className="text-left">
            <p className="text-sm text-gray-400">Checking conditions for</p>
            <p className="text-lg font-semibold text-white">
              {isNow(selectedTime) ? "Now" : `${formatDay(selectedTime)} ${formatTime(selectedTime)}`}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Time options */}
      {isExpanded && (
        <div className="bg-dark-elevated rounded-xl border border-dark-border p-3 max-h-64 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-4 gap-2">
            {timeOptions.map((time, index) => {
              const isSelected = time.getTime() === selectedTime.getTime();
              const daytime = isDaytime(time);

              return (
                <button
                  key={index}
                  onClick={() => {
                    onTimeChange(time);
                    setIsExpanded(false);
                  }}
                  className={`
                    flex flex-col items-center p-2 rounded-lg text-sm
                    transition-colors min-h-touch
                    ${isSelected
                      ? "bg-drone-500 text-white"
                      : daytime
                        ? "bg-dark-surface text-white hover:bg-dark-border"
                        : "bg-dark-surface/50 text-gray-500 hover:bg-dark-border"
                    }
                  `}
                >
                  <span className="text-xs opacity-70">
                    {index === 0 ? "Now" : formatDay(time)}
                  </span>
                  <span className="font-mono font-medium">{formatTime(time)}</span>
                  <span className="text-xs">{daytime ? "☀️" : "🌙"}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            ☀️ Daytime hours (6am - 6pm) recommended for flying
          </p>
        </div>
      )}
    </div>
  );
}
