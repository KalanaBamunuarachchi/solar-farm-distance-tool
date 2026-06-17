type Coordinates = {
    lat: number;
    lng: number;
};

export function calculateDistanceKm(
    pointA: Coordinates,
    pointB: Coordinates
): number {
    const earthRadiusKm = 6371;

    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);

    const a =
        Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLng / 2), 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}