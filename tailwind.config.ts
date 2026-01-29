import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verdict colors - high contrast for outdoor visibility
        go: {
          DEFAULT: "#22c55e",
          dark: "#16a34a",
        },
        caution: {
          DEFAULT: "#eab308",
          dark: "#ca8a04",
        },
        nogo: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        // Drone theme accent
        drone: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // OLED-optimized dark mode
        dark: {
          bg: "#000000",
          surface: "#0a0a0a",
          elevated: "#141414",
          border: "#262626",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["SF Mono", "Menlo", "Monaco", "monospace"],
      },
      fontSize: {
        // Large touch-friendly sizes
        "verdict-xl": ["4rem", { lineHeight: "1", fontWeight: "800" }],
        "verdict-lg": ["3rem", { lineHeight: "1", fontWeight: "800" }],
      },
      spacing: {
        // Touch target minimum 48px
        touch: "48px",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-go": "0 0 30px rgba(34, 197, 94, 0.4)",
        "glow-caution": "0 0 30px rgba(234, 179, 8, 0.4)",
        "glow-nogo": "0 0 30px rgba(239, 68, 68, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
