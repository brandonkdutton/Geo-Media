import React, { FC } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useAppSelector } from "../../../../redux/hooks";
import { selectAllLocations } from "../../../../redux/slices/locationsSlice";
import { Location } from "../../../../types/locationTypes";
import MapEventsController from "./MapEventsController";
import LocationMarker from "./LocationMarker";
import ZoomControl from "./ZoomControl";
import "./mapStyle.css";

const MapComponent: FC = () => {
  const initialZoom = 4;
  const locations: Location[] = useAppSelector(selectAllLocations);
  const unconfirmedLocation = useAppSelector(
    ({ locations }) => locations.unconfirmedLocation
  );

  return (
    <MapContainer center={[39, -101]} zoom={initialZoom} zoomControl={false}>
      <TileLayer
        url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
        attribution="&copy; NASA Blue Marble, image service by OpenGeo"
        maxZoom={8}
      />
      {locations.map((loc: Location) => (
        <LocationMarker
          key={loc.id}
          locId={loc.id}
          coordinates={loc.coordinates}
        />
      ))}
      {unconfirmedLocation.lat && unconfirmedLocation.lng && (
        <LocationMarker
          locId={-2}
          coordinates={[
            unconfirmedLocation.lat as number,
            unconfirmedLocation.lng as number,
          ]}
        />
      )}

      <ZoomControl />
      <MapEventsController />
    </MapContainer>
  );
};

export default MapComponent;
