import React, { useEffect, useState, useContext } from "react";
import { Map, Marker, TileLayer} from "react-leaflet";
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Icon} from "leaflet";
import './mapStyle.css';

import { locationContext } from '../Home/reducerContextWrappers/LocationContextWrapper';

const useStyles = makeStyles((theme) => ({
    spinnerBox: {
        zIndex: 500,
        width: '100%',
        height: '100%',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export default function App() {
    const classes = useStyles();
    const [curPos, setCurPos] = useState([0, 0]);
    const [nearLocationData, setNearLocationData] = useState([]);
    const [allLocations, setAllLocations] = useState([]);

    // used to set/unset the post currentley being viewed by clicking on the map markers
    const { locationState, locationDispatch } = useContext(locationContext);

    // refreshes the map's location related state whenever global location state changes
    // local states used because the map refuses to refresh based on global state
    useEffect(() => {
        setCurPos(locationState.geoLocation);
        setNearLocationData(locationState.near);
        setAllLocations(locationState.allLocations);

    }, [locationState]);

    const orangeIcon = new Icon({
        iconUrl: 'marker-icon-orange.png',
        shadowUrl: 'marker-shadow.png',
    });

    const blueIcon = new Icon({
        iconUrl: 'marker-icon-blue.png',
        shadowUrl: 'marker-shadow.png',
    });

    // a "you are hear" marker to be shown if no nearby locations already exist
    const youAreHereMarker = () => {
        return (
            <Marker
                position={curPos}
                icon={orangeIcon}
                onClick={locationState.current === null
                    ? () => locationDispatch({type: 'setCurrent', payload: -1})
                    : () => locationDispatch({type: 'setCurrent', payload: null})
                }
            />
        );
    };

    const loading = (curPos[0] === 0 && curPos[1] === 0) && locationState.geoLocationEnabled;
    const initialMapZoom = locationState.geoLocationEnabled ? 8 : 2;

    return (
        <Map center={curPos} zoom={initialMapZoom} zoomControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {allLocations.map(loc => (
                <Marker
                    key={loc.id}
                    icon={nearLocationData && nearLocationData.includes(loc.id)
                        ? orangeIcon
                        : blueIcon
                    }
                    position={[
                        loc.coordinates[0],
                        loc.coordinates[1]
                    ]}
                    onClick={locationState.current === null 
                        ? () => locationDispatch({type: 'setCurrent', payload: loc.id})
                        : () => locationDispatch({type: 'setCurrent', payload: null})
                    }
                />
            ))}

            {!loading && nearLocationData.length === 0 && locationState.geoLocationEnabled &&
                youAreHereMarker()
            }

            {loading && 
                <div className={classes.spinnerBox}>
                    <CircularProgress/>
                </div>
            }
            
        </Map>
    );
}