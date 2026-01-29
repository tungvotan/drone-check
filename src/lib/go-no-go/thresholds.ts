import type { VerdictLevel } from "@/types";

export interface Thresholds {
  wind: {
    go: number;
    caution: number;
    nogo: number;
  };
  gusts: {
    go: number;
    caution: number;
    nogo: number;
  };
  visibility: {
    go: number;
    caution: number;
    nogo: number;
  };
  precipitation: {
    go: number;
    caution: number;
    nogo: number;
  };
  daylight: {
    go: number;
    caution: number;
    nogo: number;
  };
}

// Default thresholds based on CASA regulations and FPV best practices
export const DEFAULT_THRESHOLDS: Thresholds = {
  wind: {
    go: 20, // km/h - comfortable for most FPV
    caution: 35, // km/h - challenging, experienced pilots only
    nogo: 35, // km/h - above this is NO-GO
  },
  gusts: {
    go: 30, // km/h
    caution: 45, // km/h
    nogo: 45, // km/h
  },
  visibility: {
    go: 5, // km - VLOS easily maintained
    caution: 2, // km - marginal VLOS
    nogo: 2, // km - below this is NO-GO
  },
  precipitation: {
    go: 0, // % probability
    caution: 30, // % probability
    nogo: 30, // % probability
  },
  daylight: {
    go: 30, // minutes to sunset
    caution: 15, // minutes
    nogo: 0, // at/after sunset
  },
};

export function evaluateThreshold(
  value: number,
  thresholds: { go: number; caution: number; nogo: number },
  higherIsBetter: boolean = false
): VerdictLevel {
  if (higherIsBetter) {
    // For visibility - higher values are better
    if (value >= thresholds.go) return "go";
    if (value >= thresholds.caution) return "caution";
    return "nogo";
  } else {
    // For wind, gusts, precipitation - lower values are better
    if (value < thresholds.go) return "go";
    if (value < thresholds.nogo) return "caution";
    return "nogo";
  }
}
