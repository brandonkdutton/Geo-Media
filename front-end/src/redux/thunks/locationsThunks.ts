import { createAsyncThunk } from "@reduxjs/toolkit";
import { Location, Geolocation, FetchError } from "../../types/locationTypes";

export const fetchLocations = createAsyncThunk<
  Location[],
  null,
  { rejectValue: FetchError }
>(
  "locations/fetchLocations",
  async (_: null, thunkApi): Promise<Location[]> => {
    const uri = `${process.env.REACT_APP_API_URI}/locations/allLocations`;
    const req = await fetch(uri);

    if (req.status < 200 || req.status >= 400) {
      const error: FetchError = await req.json();
      thunkApi.rejectWithValue({ message: error.message });
    }

    type RawResponse = { locId: number; lat: string; lng: string };
    const { locations: raw }: { locations: RawResponse[] } = await req.json();

    const locations: Location[] = raw.map((r: RawResponse) => {
      return {
        id: r.locId,
        coordinates: [parseFloat(r.lat), parseFloat(r.lng)],
      };
    });

    return locations;
  }
);

export const createLocation = createAsyncThunk<
  Location,
  Geolocation,
  { rejectValue: FetchError }
>(
  "locations/createLocation",
  async (locationToCreate: Geolocation, thunkApi): Promise<Location> => {
    const uri = `${process.env.REACT_APP_API_URI}/locations/allLocations?lat=${locationToCreate.lat}&lng=${locationToCreate.lng}`;
    const req = await fetch(uri, { method: "POST" });

    if (req.status < 200 || req.status >= 400) {
      const error: FetchError = await req.json();
      thunkApi.rejectWithValue({ message: error.message });
    }

    const { newLocationId }: { newLocationId: number } = await req.json();
    return {
      id: newLocationId,
      coordinates: [
        locationToCreate.lat as number,
        locationToCreate.lng as number,
      ],
    };
  }
);
