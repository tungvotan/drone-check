"use client";

import type { FactorResult, VerdictLevel } from "@/types";

interface FactorBreakdownProps {
  factors: FactorResult[];
}

const verdictColors: Record<VerdictLevel, string> = {
  go: "text-go border-go/30 bg-go/10",
  caution: "text-caution border-caution/30 bg-caution/10",
  nogo: "text-nogo border-nogo/30 bg-nogo/10",
};

const verdictIcons: Record<VerdictLevel, React.ReactNode> = {
  go: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  caution: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  nogo: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

export function FactorBreakdown({ factors }: FactorBreakdownProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white px-1">Flight Factors</h2>
      <div className="space-y-2">
        {factors.map((factor) => (
          <div
            key={factor.name}
            className={`
              flex items-center justify-between p-4 rounded-xl border
              ${verdictColors[factor.verdict]}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={verdictColors[factor.verdict].split(" ")[0]}>
                {verdictIcons[factor.verdict]}
              </span>
              <div>
                <p className="font-medium text-white">{factor.name}</p>
                <p className="text-sm text-gray-400">{factor.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold text-white">
                {factor.value}
              </p>
              {factor.unit && (
                <p className="text-xs text-gray-500">{factor.unit}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
