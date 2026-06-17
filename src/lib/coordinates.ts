import type { Coordinates } from "@/lib/types";

type ParsedDmsCoordinate = {
  value: number;
  axis?: "lat" | "lng";
};

export function parseCoordinates(
  latitudeInput: string,
  longitudeInput: string,
  combinedInput: string
): Coordinates | null {
  const trimmedLatitude = latitudeInput.trim();
  const trimmedLongitude = longitudeInput.trim();
  const trimmedCombined = combinedInput.trim();

  if (trimmedLatitude !== "" || trimmedLongitude !== "") {
    return normalizeCoordinates(
      parseDecimalCoordinate(trimmedLatitude),
      parseDecimalCoordinate(trimmedLongitude)
    );
  }

  if (trimmedCombined === "") {
    return null;
  }

  return parseCombinedDmsCoordinates(trimmedCombined);
}

function parseCombinedDmsCoordinates(input: string): Coordinates | null {
  const coordinates = extractDmsCoordinates(input);
  const latCandidate =
    coordinates.find((coordinate) => coordinate.axis === "lat") ??
    coordinates[0];
  const lngCandidate =
    coordinates.find((coordinate) => coordinate.axis === "lng") ??
    coordinates.find((coordinate) => coordinate !== latCandidate) ??
    coordinates[1];

  if (!latCandidate || !lngCandidate) {
    return null;
  }

  return normalizeCoordinates(latCandidate.value, lngCandidate.value);
}

function parseDecimalCoordinate(input: string): number | null {
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(input)) {
    return null;
  }

  const value = Number(input);

  return Number.isFinite(value) ? value : null;
}

function extractDmsCoordinates(input: string): ParsedDmsCoordinate[] {
  const dmsPattern =
    /([NSWE])?\s*([+-]?\d{1,3})(?:\s*\u00b0|\s+)(\d{1,2})(?:\s*['\u2019\u2032]|\s+)(\d{1,2}(?:\.\d+)?)(?:\s*(?:"|\u201d|\u2033))?\s*([NSWE])?/gi;
  const matches = input.matchAll(dmsPattern);
  const parsedCoordinates: ParsedDmsCoordinate[] = [];

  for (const match of matches) {
    const prefixDirection = match[1]?.toUpperCase();
    const suffixDirection = match[5]?.toUpperCase();
    const direction = suffixDirection ?? prefixDirection;
    const axis = getAxisFromDirection(direction);
    const degrees = Number(match[2]);
    const minutes = Number(match[3]);
    const seconds = Number(match[4]);

    if (!isValidDmsParts(degrees, minutes, seconds)) {
      continue;
    }

    parsedCoordinates.push({
      value: dmsToDecimal(degrees, minutes, seconds, direction),
      axis,
    });
  }

  return parsedCoordinates.filter((coordinate) =>
    Number.isFinite(coordinate.value)
  );
}

function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  direction?: string
): number {
  const unsignedValue = Math.abs(degrees) + minutes / 60 + seconds / 3600;
  const isNegativeDirection = direction === "S" || direction === "W";
  const isNegativeDegrees = degrees < 0;

  return isNegativeDirection || isNegativeDegrees ? -unsignedValue : unsignedValue;
}

function isValidDmsParts(
  degrees: number,
  minutes: number,
  seconds: number
): boolean {
  return (
    Number.isFinite(degrees) &&
    Number.isFinite(minutes) &&
    Number.isFinite(seconds) &&
    minutes >= 0 &&
    minutes < 60 &&
    seconds >= 0 &&
    seconds < 60
  );
}

function normalizeCoordinates(
  lat: number | null,
  lng: number | null
): Coordinates | null {
  if (lat === null || lng === null) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}

function getAxisFromDirection(direction?: string): "lat" | "lng" | undefined {
  if (direction === "N" || direction === "S") {
    return "lat";
  }

  if (direction === "E" || direction === "W") {
    return "lng";
  }

  return undefined;
}
