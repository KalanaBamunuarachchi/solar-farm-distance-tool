import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Ruler,
  Zap,
  MoveDiagonal,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { GridStation } from "@/data/gridStations";

type Coordinates = {
  lat: number;
  lng: number;
};

type ResultPanelProps = {
  selectedLocation: Coordinates | null;
  selectedStation: GridStation | null;
  distanceToStationKm: number | null;
};

export default function ResultPanel({
  selectedLocation,
  selectedStation,
  distanceToStationKm,
}: Readonly<ResultPanelProps>) {
  const hasResult =
    selectedLocation !== null &&
    selectedStation !== null &&
    typeof distanceToStationKm === "number";
  const isWithinRange = hasResult && distanceToStationKm <= 5;

  return (
    <Card className="border-l-4 border-l-green-600">
      <CardContent className="space-y-4 p-4">
        <h2 className="font-semibold">3. Distance Result</h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-50">
              <MoveDiagonal className="size-7" />
            </div>

            <div>
              <p className="text-3xl font-bold sm:text-4xl">
                {hasResult ? `${distanceToStationKm.toFixed(2)} km` : "-- km"}
              </p>
              <p className="text-sm text-muted-foreground">As the crow flies</p>
            </div>
          </div>

          <div
            className={
              isWithinRange
                ? "flex items-center gap-3 rounded-lg border border-green-200 p-4"
                : "flex items-center gap-3 rounded-lg border border-amber-200 p-4"
            }
          >
            {isWithinRange ? (
              <CheckCircle2 className="size-6 text-green-600" />
            ) : (
              <AlertTriangle className="size-6 text-amber-600" />
            )}
            <div>
              <p className="font-semibold">
                {hasResult
                  ? isWithinRange
                    ? "Within 5 km"
                    : "Over 5 km"
                  : "Awaiting location"}
              </p>
              <p
                className={
                  isWithinRange
                    ? "text-sm font-medium text-green-600"
                    : "text-sm font-medium text-amber-600"
                }
              >
                {hasResult ? (isWithinRange ? "Suitable" : "Review needed") : "Pending"}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-start justify-between gap-3 border-b px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>Selected Location</span>
            </div>
            <span className="text-right">
              {selectedLocation
                ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                : "Not selected"}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 border-b px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <span>Grid Station</span>
            </div>
            <span className="text-right">{selectedStation?.name ?? "Not selected"}</span>
          </div>

          <div className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Ruler className="size-4" />
              <span>Distance</span>
            </div>
            <span className="text-right">
              {typeof distanceToStationKm === "number"
                ? `${distanceToStationKm.toFixed(2)} km`
                : "-- km"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
