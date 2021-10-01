export type LocId = number | null;
export type Lat = number | null;
export type Lng = number | null;
export type Geolocation = { lat: Lat; lng: Lng };

export interface Location {
  id: number;
  coordinates: [number, number];
}
export interface FetchError {
  message: string;
}
