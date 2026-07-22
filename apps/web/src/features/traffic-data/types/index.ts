export type TrafficRecord = {
  stationCode: string;
  stationName: string;
  direction: string;
  vehicleType: string;
  volume: number;
  recordedAt: string;
};

export type TrafficUploadSource = "csv" | "xlsx";
