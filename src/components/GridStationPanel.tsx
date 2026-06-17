"use client";

import * as React from "react";

import StationCard from "@/components/StationCard";
import { gridStations } from "@/data/gridStations";
import type { GridStation } from "@/data/gridStations";
import { Card, CardContent } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type Coordinates = {
  lat: number;
  lng: number;
};

type GridStationPanelProps = {
  selectedLocation: Coordinates | null;
  suggestedStation: GridStation | null;
  manualStation: GridStation | null;
  onManualStationChange: (station: GridStation | null) => void;
  distanceToStationKm: number | null;
};

type StationCardState = "empty" | "automatic" | "manual";

export default function GridStationPanel({
  selectedLocation,
  suggestedStation,
  manualStation,
  onManualStationChange,
  distanceToStationKm,
}: Readonly<GridStationPanelProps>) {
  const activeStation = manualStation ?? suggestedStation;

  let cardState: StationCardState;

  if (selectedLocation === null) {
    cardState = "empty";
  } else if (manualStation === null) {
    cardState = "automatic";
  } else {
    cardState = "manual";
  }

  const isStationSelectionDisabled = selectedLocation === null;

  return (
    <Card className="border-l-4 border-l-green-600">
      <CardContent className="space-y-4 p-4">
        <h2 className="font-semibold">2. Grid Station Selection</h2>

        <StationCard
          state={cardState}
          station={
            activeStation
              ? {
                name: activeStation.name,
                province: activeStation.province,
                distanceKm: distanceToStationKm ?? undefined,
              }
              : undefined
          }
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">Select Different Grid Station</p>

          <div
            className={
              isStationSelectionDisabled ? "pointer-events-none opacity-50" : ""
            }
          >
            <Combobox
              items={gridStations}
              value={manualStation}
              onValueChange={onManualStationChange}
              itemToStringLabel={(station) => station.name}
              itemToStringValue={(station) => station.id}
            >
              <ComboboxInput
                placeholder={manualStation?.name ?? "Select a Grid Station"}
              />

              <ComboboxContent>
                <ComboboxEmpty>No Grid Station found.</ComboboxEmpty>

                <ComboboxList>
                  {(station) => (
                    <ComboboxItem key={station.id} value={station}>
                      {station.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {isStationSelectionDisabled && (
            <p className="text-xs text-muted-foreground">
              Select a location first to enable manual GSS selection.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
