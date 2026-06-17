"use client";

import * as React from "react";
import { Search } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button";
import { parseCoordinates } from "@/lib/coordinates";

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationPanelProps = {
  selectedLocation: Coordinates | null;
  onLocationChange: (location: Coordinates) => void;
};

export default function LocationPanel({ selectedLocation, onLocationChange, }: Readonly<LocationPanelProps>) {
  const [latitudeInput, setLatitudeInput] = React.useState("");
  const [longitudeInput, setLongitudeInput] = React.useState("");
  const [coordinateInput, setCoordinateInput] = React.useState("");
  const [coordinateError, setCoordinateError] = React.useState("");

  function handleCoordinateSearch() {
    const coordinates = parseCoordinates(
      latitudeInput,
      longitudeInput,
      coordinateInput
    );

    if (!coordinates) {
      setCoordinateError("Enter decimal latitude/longitude or paste combined DMS.");
      return;
    }

    setCoordinateError("");
    onLocationChange(coordinates);
  }

  return (
    <Card className="border-l-4 border-l-green-600">
      <CardContent className="space-y-4 p-4">
        <h2 className="font-semibold">1. Select Your Location</h2>

        <Tabs defaultValue="pin">
          <div className="overflow-x-auto">
            <TabsList className="h-auto min-w-full">
              <TabsTrigger value="pin" className="min-w-24 text-xs sm:text-sm">Pin on Map</TabsTrigger>
              <TabsTrigger value="latlng" className="min-w-24 text-xs sm:text-sm">Lat / Long</TabsTrigger>
              <TabsTrigger value="search" className="min-w-28 text-xs sm:text-sm">Search Address</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="pin">
            <div className="rounded-lg border bg-muted/30 p-2 text-sm text-muted-foreground">
              Click anywhere on the map to select a site location.
            </div>
          </TabsContent>
          <TabsContent value="latlng" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={latitudeInput}
                onChange={(event) => setLatitudeInput(event.target.value)}
                placeholder="Latitude: 6.503583"
              />
              <Input
                value={longitudeInput}
                onChange={(event) => setLongitudeInput(event.target.value)}
                placeholder="Longitude: 80.090139"
              />
            </div>

            <Input
              value={coordinateInput}
              onChange={(event) => setCoordinateInput(event.target.value)}
              placeholder={`Paste combined DMS: 6°30'12.9"N 80°05'24.5"E`}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Accept decimal degrees and combined DMS.
              </p>

              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleCoordinateSearch}
              >
                <Search className="mr-2 size-4" />
                Search
              </Button>
            </div>

            {coordinateError && (
              <p className="text-xs font-medium text-red-600">
                {coordinateError}
              </p>
            )}
          </TabsContent>
          <TabsContent value="search">
            <div className="relative">
              <Input
                placeholder="Search for an address or place"
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2  text-muted-foreground" />
            </div>
          </TabsContent>
        </Tabs>
        <div className="rounded-lg border p-3">
          {selectedLocation ? (
            <>
              <p className="text-sm font-medium">Selected Map Location</p>
              <p className="text-sm text-muted-foreground">
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">No Location Selected</p>
              <p className="text-sm text-muted-foreground">
                Click anywhere on the map to select a site location.
              </p>
            </>
          )}
        </div>


      </CardContent>

    </Card>
  )
}
