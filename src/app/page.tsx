"use client";

import * as React from "react";

import Header from "@/components/Header";
import LocationPanel from "@/components/LocationPanel";
import GridStationPanel from "@/components/GridStationPanel";
import MapView from "@/components/MapView";
import ResultPanel from "@/components/ResultPanel";
import SiteDetailsPanel from "@/components/SiteDetailsPanel";
import DataSetPanel from "@/components/DataSetPanel";
import { gridStations } from "@/data/gridStations";
import { findNearestStation } from "@/lib/stations";
import { calculateDistanceKm } from "@/lib/distance";
import type { GridStation } from "@/data/gridStations";
import type { SiteEntry } from "@/lib/siteEntries";


type Coordinates = {
  lat: number;
  lng: number;
};



export default function Home() {
  const [selectedLocation, setSelectedLocation] =
    React.useState<Coordinates | null>(null);
  const [manualStation, setManualStation] = React.useState<GridStation | null>(
    null
  );
  const [siteEntries, setSiteEntries] = React.useState<SiteEntry[]>([]);
  const [editingEntry, setEditingEntry] = React.useState<SiteEntry | null>(
    null
  );

  const nearestStationResult = selectedLocation
    ? findNearestStation(selectedLocation, gridStations)
    : null;

  const suggestedStation = nearestStationResult?.station ?? null;
  const selectedStation = manualStation ?? suggestedStation;
  const distanceToStationKm =
    selectedLocation && selectedStation
      ? calculateDistanceKm(selectedLocation, selectedStation)
      : null;

  function handleAddSiteEntry(entry: SiteEntry) {
    setSiteEntries((currentEntries) => [
      ...currentEntries,
      {
        ...entry,
        id: currentEntries.length + 1,
      },
    ]);
  }

  function handleUpdateSiteEntry(updatedEntry: SiteEntry) {
    setSiteEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditingEntry(null);
  }

  function handleDeleteSiteEntry(entryId: number) {
    setSiteEntries((currentEntries) =>
      currentEntries
        .filter((entry) => entry.id !== entryId)
        .map((entry, index) => ({
          ...entry,
          id: index + 1,
        }))
    );
    setEditingEntry((currentEntry) =>
      currentEntry?.id === entryId ? null : currentEntry
    );
  }

  function handleImportSiteEntries(entries: SiteEntry[]) {
    setSiteEntries(entries);
    setEditingEntry(null);
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="grid gap-3 p-3 sm:gap-4 sm:p-6 lg:grid-cols-[520px_1fr]">
        <aside className="min-w-0 space-y-3 sm:space-y-4">
          <LocationPanel
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />

          <GridStationPanel
            selectedLocation={selectedLocation}
            suggestedStation={suggestedStation}
            manualStation={manualStation}
            onManualStationChange={setManualStation}
            distanceToStationKm={distanceToStationKm}
          />

          <ResultPanel
            selectedLocation={selectedLocation}
            selectedStation={selectedStation}
            distanceToStationKm={distanceToStationKm}
          />
        </aside>

        <section className="min-w-0">
          <MapView
            selectedLocation={selectedLocation}
            selectedStation={selectedStation}
            onLocationChange={setSelectedLocation}
          />
        </section>

        <section className="min-w-0 lg:col-span-2">
          <SiteDetailsPanel
            key={editingEntry?.id ?? "new-entry"}
            selectedLocation={selectedLocation}
            selectedStation={selectedStation}
            distanceToStationKm={distanceToStationKm}
            nextEntryId={siteEntries.length + 1}
            editingEntry={editingEntry}
            onAddEntry={handleAddSiteEntry}
            onUpdateEntry={handleUpdateSiteEntry}
            onCancelEdit={() => setEditingEntry(null)}
          />
        </section>

        <section className="min-w-0 lg:col-span-2">
          <DataSetPanel
            entries={siteEntries}
            onClearEntries={() => {
              setSiteEntries([]);
              setEditingEntry(null);
            }}
            onEditEntry={setEditingEntry}
            onDeleteEntry={handleDeleteSiteEntry}
            onImportEntries={handleImportSiteEntries}
          />
        </section>
      </section>
    </main>
  );
}
