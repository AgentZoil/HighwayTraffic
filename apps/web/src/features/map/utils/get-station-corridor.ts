import { northSouthTollStations } from "@/features/map/data/toll-stations";
import type { TollStation } from "@/features/map/types";

export function getStationCorridor(startStationId: string, endStationId: string): TollStation[] {
  const startIndex = Math.max(
    northSouthTollStations.findIndex((station) => station.id === startStationId),
    0
  );
  const endIndex = Math.max(
    northSouthTollStations.findIndex((station) => station.id === endStationId),
    0
  );
  const first = Math.min(startIndex, endIndex);
  const last = Math.max(startIndex, endIndex);

  return northSouthTollStations.slice(first, last + 1);
}
