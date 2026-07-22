export type TollStation = {
  id: string;
  name: string;
  province: string;
  kmMarker: string;
  status: "active" | "maintenance-planned";
  coordinates: [number, number];
  note: string;
};
