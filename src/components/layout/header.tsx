"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Drone Check",
  "/map": "Airspace Map",
  "/spots": "FPV Spots",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();

  // Get title based on pathname, with fallback for dynamic routes
  const getTitle = () => {
    if (pathname.startsWith("/spots/") && pathname !== "/spots") {
      return "Spot Details";
    }
    return pageTitles[pathname] || "Drone Check";
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-semibold text-white">{getTitle()}</h1>
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div className="w-2 h-2 rounded-full bg-drone-500 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
