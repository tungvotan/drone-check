"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import { createClient } from "@/lib/supabase/client";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function SettingsPage() {
  const { darkMode, setDarkMode, units, setUnits, clearLocation } = useAppStore();
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      // Show success message or update UI
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Account section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Account
        </h2>
        <div className="bg-dark-elevated rounded-2xl border border-dark-border overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <div className="h-12 skeleton rounded" />
            </div>
          ) : user ? (
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.user_metadata.avatar_url && (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                )}
                <div>
                  <p className="font-medium text-white">
                    {user.user_metadata.full_name || user.email}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center justify-between p-4 hover:bg-dark-surface transition-colors"
            >
              <div>
                <p className="font-medium text-white">Sign in</p>
                <p className="text-sm text-gray-500">
                  Save favorites and sync across devices
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* Appearance section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Appearance
        </h2>
        <div className="bg-dark-elevated rounded-2xl border border-dark-border overflow-hidden divide-y divide-dark-border">
          <SettingRow
            label="Theme"
            description="Choose your preferred theme"
          >
            <select
              value={darkMode}
              onChange={(e) => setDarkMode(e.target.value as "system" | "light" | "dark")}
              className="bg-dark-surface text-white px-3 py-2 rounded-lg border border-dark-border min-h-touch"
            >
              <option value="system">System</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Units"
            description="Wind speed and distance units"
          >
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value as "metric" | "imperial")}
              className="bg-dark-surface text-white px-3 py-2 rounded-lg border border-dark-border min-h-touch"
            >
              <option value="metric">Metric (km/h)</option>
              <option value="imperial">Imperial (mph)</option>
            </select>
          </SettingRow>
        </div>
      </section>

      {/* Location section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Location
        </h2>
        <div className="bg-dark-elevated rounded-2xl border border-dark-border overflow-hidden">
          <button
            onClick={clearLocation}
            className="w-full flex items-center justify-between p-4 hover:bg-dark-surface transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-white">Reset Location</p>
              <p className="text-sm text-gray-500">
                Clear cached location and request again
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Install PWA */}
      {isInstallable && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            App
          </h2>
          <div className="bg-dark-elevated rounded-2xl border border-dark-border overflow-hidden">
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-between p-4 hover:bg-dark-surface transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-white">Install App</p>
                <p className="text-sm text-gray-500">
                  Add to home screen for quick access
                </p>
              </div>
              <span className="text-2xl">📲</span>
            </button>
          </div>
        </section>
      )}

      {/* About section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          About
        </h2>
        <div className="bg-dark-elevated rounded-2xl border border-dark-border overflow-hidden divide-y divide-dark-border">
          <div className="p-4">
            <p className="font-medium text-white">Drone Check</p>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-dark-surface transition-colors"
          >
            <p className="text-white">Source Code</p>
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="p-4 bg-dark-elevated rounded-xl border border-dark-border">
        <p className="text-xs text-gray-500 text-center">
          ⚠️ This app provides guidance only. Always check NOTAMs, local regulations,
          and CASA requirements before flying. Data is sourced from BOM and community
          contributions. Not for commercial operations.
        </p>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
