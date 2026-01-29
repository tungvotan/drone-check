"use client";

import { useRef, useCallback, useState } from "react";
import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import type { Spot } from "@/types";
import "mapbox-gl/dist/mapbox-gl.css";

interface DroneMapProps {
  spots?: Spot[];
  onSpotClick?: (spot: Spot) => void;
  initialCenter?: { latitude: number; longitude: number };
  showAirspace?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const OPENAIP_KEY = process.env.NEXT_PUBLIC_OPENAIP_KEY;

// Default to center of Australia
const DEFAULT_CENTER = { latitude: -25.2744, longitude: 133.7751 };
const DEFAULT_ZOOM = 4;

export function DroneMap({
  spots = [],
  onSpotClick,
  initialCenter,
  showAirspace = true,
}: DroneMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    ...( initialCenter || DEFAULT_CENTER),
    zoom: initialCenter ? 10 : DEFAULT_ZOOM,
  });

  // Airspace tile layer URL (OpenAIP)
  const airspaceTileUrl = OPENAIP_KEY
    ? `https://api.tiles.openaip.net/api/data/airspaces/{z}/{x}/{y}.png?apiKey=${OPENAIP_KEY}`
    : null;

  const handleMarkerClick = useCallback(
    (spot: Spot) => {
      if (onSpotClick) {
        onSpotClick(spot);
      }
      // Fly to spot
      mapRef.current?.flyTo({
        center: [spot.longitude, spot.latitude],
        zoom: 12,
        duration: 1000,
      });
    },
    [onSpotClick]
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-elevated">
        <div className="text-center p-4">
          <p className="text-gray-400 mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500">Mapbox token not configured</p>
        </div>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      {/* Navigation controls */}
      <NavigationControl position="top-right" showCompass showZoom />
      <GeolocateControl
        position="top-right"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation
        showUserHeading
      />

      {/* Airspace overlay */}
      {showAirspace && airspaceTileUrl && (
        <Source
          id="airspace"
          type="raster"
          tiles={[airspaceTileUrl]}
          tileSize={256}
          minzoom={7}
          maxzoom={18}
        >
          <Layer
            id="airspace-layer"
            type="raster"
            paint={{ "raster-opacity": 0.6 }}
          />
        </Source>
      )}

      {/* Spot markers */}
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          latitude={spot.latitude}
          longitude={spot.longitude}
          anchor="bottom"
          onClick={() => handleMarkerClick(spot)}
        >
          <SpotMarker type={spot.type} />
        </Marker>
      ))}
    </Map>
  );
}

function SpotMarker({ type }: { type: string }) {
  const getColor = () => {
    switch (type) {
      case "maaa_club":
        return "bg-drone-500";
      case "community":
        return "bg-blue-500";
      case "park":
        return "bg-green-500";
      case "field":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`
        w-8 h-8 rounded-full ${getColor()}
        flex items-center justify-center
        border-2 border-white shadow-lg
        cursor-pointer hover:scale-110 transition-transform
      `}
    >
      <svg
        className="w-4 h-4 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default DroneMap;
