import type { Coordinates } from "@/lib/types";

const codeAlphabet = "23456789CFGHJMPQRVWX";
const separator = "+";
const padding = "0";
const separatorPosition = 8;
const pairCodeLength = 10;
const latMax = 90;
const lngMax = 180;
const pairResolutions = [20, 1, 0.05, 0.0025, 0.000125];
const gridRows = 5;
const gridColumns = 4;

export function decodePlusCode(input: string): Coordinates | null {
  const code = input.trim().toUpperCase();

  if (!isFullPlusCode(code)) {
    return null;
  }

  const cleanCode = code.replace(separator, "").replaceAll(padding, "");
  const pairCode = cleanCode.slice(0, pairCodeLength);
  const gridCode = cleanCode.slice(pairCodeLength);
  const decodedPair = decodePairs(pairCode);

  if (!decodedPair) {
    return null;
  }

  const decodedGrid = decodeGrid(gridCode, decodedPair);
  const lat = decodedGrid.lat + decodedGrid.latResolution / 2;
  const lng = decodedGrid.lng + decodedGrid.lngResolution / 2;

  if (lat < -latMax || lat > latMax || lng < -lngMax || lng > lngMax) {
    return null;
  }

  return { lat, lng };
}

function isFullPlusCode(code: string): boolean {
  const separatorIndex = code.indexOf(separator);

  if (separatorIndex !== separatorPosition) {
    return false;
  }

  if (code.indexOf(separator, separatorIndex + 1) !== -1) {
    return false;
  }

  const cleanCode = code.replace(separator, "");

  if (cleanCode.length < pairCodeLength || cleanCode.length > 15) {
    return false;
  }

  return [...cleanCode].every(
    (character) => character === padding || codeAlphabet.includes(character)
  );
}

function decodePairs(code: string) {
  let lat = -latMax;
  let lng = -lngMax;
  let latResolution = pairResolutions[0];
  let lngResolution = pairResolutions[0];

  for (let index = 0; index < code.length; index += 2) {
    const latDigit = codeAlphabet.indexOf(code[index]);
    const lngDigit = codeAlphabet.indexOf(code[index + 1]);
    const resolution = pairResolutions[index / 2];

    if (latDigit < 0 || lngDigit < 0 || resolution === undefined) {
      return null;
    }

    lat += latDigit * resolution;
    lng += lngDigit * resolution;
    latResolution = resolution;
    lngResolution = resolution;
  }

  return { lat, lng, latResolution, lngResolution };
}

function decodeGrid(
  code: string,
  area: {
    lat: number;
    lng: number;
    latResolution: number;
    lngResolution: number;
  }
) {
  let { lat, lng, latResolution, lngResolution } = area;

  for (const character of code) {
    const digit = codeAlphabet.indexOf(character);

    if (digit < 0) {
      break;
    }

    latResolution /= gridRows;
    lngResolution /= gridColumns;
    lat += Math.floor(digit / gridColumns) * latResolution;
    lng += (digit % gridColumns) * lngResolution;
  }

  return { lat, lng, latResolution, lngResolution };
}
