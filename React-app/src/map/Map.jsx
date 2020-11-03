import React, { useEffect, useState } from "react";
import { Map, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { Icon, popup } from "leaflet";
import './mapStyle.css';

export default function App(props) {
    const [curPos, setCurPos] = useState([0, 0]);

    const { handleDrawerClose, handleDrawerOpen } = props.handleDrawer;
    const drawerState = props.drawerState;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurPos([position.coords.latitude, position.coords.longitude])
            });
        } else {
            alert("Geolocation is not supported by this browser. You won't be able to make or reply to posts, but you can read existing ones.");
        }
    }, []);

    const orangeIcon = new Icon({
        iconUrl: 'marker-icon-orange.png',
        shadowUrl: 'marker-shadow.png',
    });

    const blueIcon = new Icon({
        iconUrl: 'marker-icon-blue.png',
        shadowUrl: 'marker-shadow.png',
    });

    const youAreHereMarker = (near) => {
        //returns a "you are hear" marker if no nearby posts exist, else returns nothing
        
        if(!near || near.length == 0) {
            return (
                <Marker
                    position={curPos}
                    icon={orangeIcon}
                    onClick={!drawerState
                        ? () => handleDrawerOpen(-1)
                        : () => handleDrawerClose(-1)
                    }
                />
            );
        } else{
            return null;
        }
    };

    return (
        <Map center={curPos} zoom={8} zoomControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {props.locationData.map(loc => (
                <Marker
                    key={loc.id}
                    icon={props.nearLocIds && props.nearLocIds.includes(loc.id)
                        ? orangeIcon
                        : blueIcon
                    }
                    position={[
                        loc.coordinates[0],
                        loc.coordinates[1]
                    ]}
                    onClick={drawerState ? () => handleDrawerClose(loc.id) : () => handleDrawerOpen(loc.id)}
                />
            ))}

            {youAreHereMarker(props.nearLocIds)}

        </Map>
    );
}