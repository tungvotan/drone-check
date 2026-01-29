"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-drone-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-drone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to Drone Check</h1>
          <p className="mt-2 text-gray-400">
            Save your favorite spots and sync across devices
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-nogo/20 border border-nogo/50 rounded-xl text-center">
            <p className="text-nogo text-sm">
              Authentication failed. Please try again.
            </p>
          </div>
        )}

        {/* Auth buttons */}
        <AuthButton />

        {/* Benefits */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-medium text-gray-400 text-center">
            Why sign in?
          </h3>
          <div className="space-y-2">
            <Benefit icon="❤️" text="Save favorite flying spots" />
            <Benefit icon="⭐" text="Rate and review locations" />
            <Benefit icon="🔄" text="Sync preferences across devices" />
            <Benefit icon="📍" text="Save custom locations" />
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-400"
          >
            Continue without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-dark-elevated rounded-xl">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}
