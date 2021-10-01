import {
  createSlice,
  createEntityAdapter,
  EntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Location, LocId, Geolocation } from "../../types/locationTypes";
import { fetchLocations, createLocation } from "../thunks/locationsThunks";

type AdditionalState = {
  openId: LocId;
  unconfirmedLocation: Geolocation;
  geolocation: Geolocation;
  currentLocationIds: LocId[];
  postCreatePending: boolean;
};
export type LocationState = EntityState<Location> & AdditionalState;

const locationsAdapter: EntityAdapter<Location> =
  createEntityAdapter<Location>();
const initialState: LocationState =
  locationsAdapter.getInitialState<AdditionalState>({
    currentLocationIds: [],
    unconfirmedLocation: {
      lat: null,
      lng: null,
    },
    geolocation: {
      lat: null,
      lng: null,
    },
    openId: null,
    postCreatePending: false,
  });

type Action<T> = { type: string; payload: T };

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setCurrentLocationCoords(
      state: LocationState,
      action: Action<Geolocation>
    ) {
      const { lat, lng }: Geolocation = action.payload;
      state.geolocation.lat = lat;
      state.geolocation.lng = lng;
    },
    setCurrentLocationIds(state: LocationState, action: Action<LocId[]>) {
      state.currentLocationIds = action.payload;
    },
    setOpenId(state: LocationState, action: Action<LocId>) {
      state.openId = action.payload;
    },
    setUnconfirmedLocation(state: LocationState, action: Action<Geolocation>) {
      state.unconfirmedLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchLocations.fulfilled,
      (state: LocationState, action: Action<Location[]>) => {
        locationsAdapter.upsertMany(state, action.payload);
      }
    );
    builder.addCase(
      createLocation.fulfilled,
      (state: LocationState, action: Action<Location>) => {
        setOpenId(action.payload.id);
        locationsAdapter.upsertOne(state, action.payload);
        state.postCreatePending = false;
      }
    );
    builder.addCase(createLocation.pending, (state: LocationState) => {
      state.postCreatePending = true;
    });
    builder.addCase(createLocation.rejected, (state: LocationState) => {
      state.postCreatePending = false;
    });
  },
});

export const {
  setUnconfirmedLocation,
  setCurrentLocationCoords,
  setCurrentLocationIds,
  setOpenId,
} = locationsSlice.actions;

export const {
  selectAll: selectAllLocations,
  selectById: selectLocationById,
  selectIds: selectLocationIds,
} = locationsAdapter.getSelectors((state: RootState) => state.locations);

export default locationsSlice.reducer;
