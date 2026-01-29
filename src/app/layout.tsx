import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { BottomNav } from "@/components/layout/bottom-nav";
import { OfflineBanner } from "@/components/layout/offline-banner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drone Check — FPV Flight Planner",
  description:
    "Go/No-Go flight decisions, weather, airspace, and FPV spots for Australian drone pilots",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Drone Check",
  },
  openGraph: {
    title: "Drone Check — FPV Flight Planner",
    description:
      "Go/No-Go flight decisions, weather, airspace, and FPV spots for Australian drone pilots",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="bg-dark-bg text-white antialiased">
        <Providers>
          <OfflineBanner />
          <main className="min-h-screen pb-20">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
