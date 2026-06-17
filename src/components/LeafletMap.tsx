"use client";
import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GridStation } from "@/data/gridStations";

type Coordinates = {
  lat: number;
  lng: number;
};

type LeafletMapProps = {
  selectedLocation: Coordinates | null;
  selectedStation: GridStation | null;
  onLocationChange: (location: Coordinates) => void;
};

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2563eb;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
        viewBox="0 0 24 24" fill="#2563eb" stroke="white"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="white" stroke="white"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const gssIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #16a34a;
      color: white;
      border: 3px solid white;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
        viewBox="0 0 24 24" fill="none" stroke="white"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);

  return null;
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (location: Coordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationChange({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function LeafletMap({ selectedLocation, selectedStation, onLocationChange, }: LeafletMapProps) {

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [7.8731, 80.7718];

  const gssLocation: [number, number] | null = selectedStation
    ? [selectedStation.lat, selectedStation.lng]
    : null;

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <RecenterMap center={mapCenter} />
      <MapClickHandler onLocationChange={onLocationChange} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedLocation && gssLocation && (
        <>
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={userIcon}
          />

          <Polyline
            positions={[[selectedLocation.lat, selectedLocation.lng], gssLocation]}
            pathOptions={{
              color: "#111827",
              weight: 3,
              dashArray: "6 6",
            }}
          />
        </>
      )}

      {gssLocation && <Marker position={gssLocation} icon={gssIcon} />}
    </MapContainer>
  );
}