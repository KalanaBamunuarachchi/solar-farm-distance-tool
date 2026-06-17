import { MapPin, Zap } from "lucide-react";

type StationCardState = "empty" | "automatic" | "manual";

type Station = {
    name: string;
    province: string;
    distanceKm?: number;
};

type StationCardProps = {
    state: StationCardState;
    station?: Station;
};

export default function StationCard({ state, station }: Readonly<StationCardProps>) {
    if (state === "empty") {
        return (
            <div className="flex gap-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                    <Zap className="size-5 text-muted-foreground" />
                </div>

                <div>
                    <p className="font-semibold">No grid station selected yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a location first. We’ll find the nearest GSS for you.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={
                state === "manual"
                    ? "rounded-lg border border-blue-200 bg-blue-50/50 p-4"
                    : "rounded-lg border border-green-200 bg-green-50/50 p-4"
            }
        >
            <div className="flex gap-4">
                <div
                    className={
                        state === "manual"
                            ? "flex size-11 items-center justify-center rounded-full bg-blue-600"
                            : "flex size-11 items-center justify-center rounded-full bg-green-600"
                    }
                >
                    <Zap className="size-5 text-white" />
                </div>

                <div className="flex-1">
                    <p className="font-semibold">{station?.name}</p>

                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {station?.province}
                    </p>

                    {station?.distanceKm !== undefined && (
                        <p
                            className={
                                state === "manual"
                                    ? "mt-1 text-sm font-medium text-blue-700"
                                    : "mt-1 text-sm font-medium text-green-700"
                            }
                        >
                            {station.distanceKm.toFixed(2)} km away
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
