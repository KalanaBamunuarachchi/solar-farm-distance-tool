import type { GridStation } from "@/data/gridStations";
import { calculateDistanceKm } from "@/lib/distance";

type Coordinates = {
  lat: number;
  lng: number;
};

export type NearestStationResult = {
  station: GridStation;
  distanceKm: number;
};

export function findNearestStation(
  location: Coordinates,
  stations: GridStation[]
): NearestStationResult {
  let nearestStation = stations[0];
  let shortestDistance = calculateDistanceKm(location, {
    lat: nearestStation.lat,
    lng: nearestStation.lng,
  });

  for (const station of stations) {
    const distance = calculateDistanceKm(location, {
      lat: station.lat,
      lng: station.lng,
    });

    if (distance < shortestDistance) {
      nearestStation = station;
      shortestDistance = distance;
    }
  }

  return {
    station: nearestStation,
    distanceKm: shortestDistance,
  };
}