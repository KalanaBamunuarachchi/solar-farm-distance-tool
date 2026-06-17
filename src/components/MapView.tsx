"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { LocateFixed, MapPin, Minus, Plus, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { GridStation } from "@/data/gridStations";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapViewProps = {
  selectedLocation: Coordinates | null;
  selectedStation: GridStation | null;
  onLocationChange: (location: Coordinates) => void;
};
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted/30">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function MapView({ selectedLocation, selectedStation, onLocationChange, }: Readonly<MapViewProps>) {
  const handleLocationChange = React.useCallback(
    (location: Coordinates) => {
      onLocationChange(location);
    },
    [onLocationChange]
  );

  function handleLocateCurrentPosition() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Unable to get your current location.");
      }
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="relative h-[360px] p-0 sm:h-[420px] lg:h-full lg:min-h-180">
        <LeafletMap
          key="bess-gridreach-map"
          selectedLocation={selectedLocation}
          selectedStation={selectedStation}
          onLocationChange={handleLocationChange}
        />
        <div className="absolute left-4 top-4 z-[1000] flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
          <button className="flex size-9 items-center justify-center border-b">
            <Plus className="size-4" />
          </button>

          <button className="flex size-9 items-center justify-center border-b">
            <Minus className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleLocateCurrentPosition}
            className="flex size-9 items-center justify-center"
          >
            <LocateFixed className="size-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-[1000] rounded-lg border bg-background p-3 shadow-sm sm:bottom-4 sm:left-4 sm:right-auto sm:p-4">
          <p className="mb-3 text-sm font-semibold">Legend</p>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground sm:gap-5">
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-blue-600" />
              Your Location
            </span>

            <span className="flex items-center gap-2">
              <Zap className="size-4 text-green-600" />
              Grid Substation
            </span>

            <span className="flex items-center gap-2">
              <span className="h-px w-6 bg-black" />
              Distance
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
