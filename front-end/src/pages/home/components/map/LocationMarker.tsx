import React, { FC } from "react";
import { Circle } from "react-leaflet";
import { markerColor } from "../../../../types/mapTypes";
import { setOpenId } from "../../../../redux/slices/locationsSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { LocId } from "../../../../types/locationTypes";

interface props {
  locId: LocId;
  coordinates: [number, number];
}

const LocationMarker: FC<props> = ({ locId, coordinates }) => {
  const size = parseInt(process.env.REACT_APP_LOCATION_RADIUS!);
  const dispatch = useAppDispatch();
  const openLocationId = useAppSelector(({ locations }) => locations.openId);
  const currentLocationIds: LocId[] = useAppSelector(
    ({ locations }) => locations.currentLocationIds
  );

  const toggleOpenLocation = (e: any): void => {
    e.originalEvent.view.L.DomEvent.stopPropagation(e);
    if (openLocationId === locId) {
      dispatch(setOpenId(null));
    } else {
      dispatch(setOpenId(locId));
    }
  };

  const color: markerColor =
    locId === -2
      ? markerColor.tertiary
      : locId === -1 || currentLocationIds.includes(locId)
      ? markerColor.secondary
      : markerColor.primary;

  return (
    <Circle
      center={coordinates}
      pathOptions={{
        color: color,
        fillColor: color,
      }}
      radius={size}
      eventHandlers={{
        click: (e) => toggleOpenLocation(e),
      }}
    />
  );
};

export default LocationMarker;
