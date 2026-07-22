import type { TrafficRecord } from "@/features/traffic-data/types";

type LooseTrafficRow = Record<string, string | number | undefined>;

export function normalizeTrafficRecord(row: LooseTrafficRow): TrafficRecord {
  return {
    stationCode: String(row.station_code ?? row.stationCode ?? "").trim(),
    stationName: String(row.station_name ?? row.stationName ?? "").trim(),
    direction: String(row.direction ?? "").trim(),
    vehicleType: String(row.vehicle_type ?? row.vehicleType ?? "").trim(),
    volume: Number(row.volume ?? 0),
    recordedAt: String(row.recorded_at ?? row.recordedAt ?? "").trim()
  };
}
