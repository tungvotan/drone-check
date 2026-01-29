"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import type { BeforeInstallPromptEvent } from "@/types";

export function useInstallPrompt() {
  const { installPrompt, setInstallPrompt } = useAppStore();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [setInstallPrompt]);

  const promptInstall = async () => {
    if (!installPrompt) return false;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);

    return outcome === "accepted";
  };

  const isInstallable = installPrompt !== null;

  return { isInstallable, promptInstall };
}
