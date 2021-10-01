import React, { useEffect, FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { Location } from "../../../../types/locationTypes";
import { useMap } from "react-leaflet";
import { LatLng, LeafletMouseEvent, LocationEvent } from "leaflet";
import {
  setOpenId,
  selectAllLocations,
  setUnconfirmedLocation,
  setCurrentLocationCoords,
  setCurrentLocationIds,
} from "../../../../redux/slices/locationsSlice";

const MapEventsController: FC = () => {
  const map = useMap();
  const dispatch = useAppDispatch();
  const locations: Location[] = useAppSelector(selectAllLocations);
  const geolocation = useAppSelector(({ locations }) => locations.geolocation);

  useEffect(() => {
    map.once("locationfound", (e: LocationEvent): void => {
      const { lat, lng } = e.latlng;
      dispatch(setCurrentLocationCoords({ lat, lng }));
    });
    map.locate();

    return () => {
      map.removeEventListener("locationfound");
    };
  }, [dispatch, map]);

  useEffect(() => {
    map.addEventListener("click", (e) => {
      const radius = parseInt(process.env.REACT_APP_LOCATION_RADIUS!);
      const clickedLocation = (e as LeafletMouseEvent).latlng;

      for (const loc of locations) {
        const existingLocation = new LatLng(...loc.coordinates);
        if (map.distance(existingLocation, clickedLocation) <= radius) {
          dispatch(setOpenId(loc.id));
          dispatch(
            setUnconfirmedLocation({
              lat: null,
              lng: null,
            })
          );
          return;
        }
      }
      dispatch(setUnconfirmedLocation(clickedLocation));
    });

    return () => {
      map.removeEventListener("click");
    };
  }, [map, dispatch, locations]);

  useEffect(() => {
    if (locations.length > 0 && geolocation.lat && geolocation.lng) {
      const radius = parseInt(process.env.REACT_APP_LOCATION_RADIUS!);

      const nearLocIds = locations
        .filter((loc: Location) => {
          const [locLat, locLng]: [number, number] = loc.coordinates;
          const { lat: geoLat, lng: geoLng } = geolocation;

          const locObj = new LatLng(locLat, locLng);
          const geolocationObj = new LatLng(geoLat as number, geoLng as number);

          const distanceToLoc = map.distance(locObj, geolocationObj);
          return distanceToLoc <= radius;
        })
        .map((loc: Location) => loc.id);

      dispatch(setCurrentLocationIds(nearLocIds));
    }
  }, [locations, geolocation, dispatch, map]);

  return null;
};

export default MapEventsController;
