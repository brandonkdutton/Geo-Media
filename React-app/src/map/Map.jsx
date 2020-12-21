import React, { useEffect, useState, useContext } from "react";
import { Map, TileLayer, Circle} from "react-leaflet";
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import Fade from '@material-ui/core/Fade';
import CustomZoomControl from './CustomZoomControll';
import './mapStyle.css';

import { locationContext } from '../Home/reducerContextWrappers/LocationContextWrapper';
import { currentUserContext } from '../users/CurrentUserContextWrapper';
import { globalSnackbarContext } from '../GlobalSnackbarWrapper';

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
    spinnerItem: {
        position: 'absolute',
    },
}));

export default function App() {
    const classes = useStyles();
    const [curPos, setCurPos] = useState([0, 0]);
    const [nearLocationData, setNearLocationData] = useState([]);
    const [allLocations, setAllLocations] = useState([]);
    const [zoom, setZoom] = useState(7);
    const [finishedLoading, setFinishedLoading] = useState(false);

    // used to set/unset the post currentley being viewed by clicking on the map markers
    const { locationState, locationDispatch } = useContext(locationContext);

    // used to provide usefull information to new users (users who are not logged in)
    const { currentUserState } = useContext(currentUserContext);
    const openSnackbar = useContext(globalSnackbarContext);


    // refreshes the map's location related state whenever global location state changes
    // local states used because the map refuses to refresh based on global state
    useEffect(() => {
        setCurPos(locationState.geoLocation);
        setNearLocationData(locationState.near);
        setAllLocations(locationState.allLocations);

        // runs only on initial page load to set initial zoom and prompt new users
        if(!finishedLoading && !locationState.loadingGeoLocation) {
            setZoom(((locationState.geoLocationEnabled || locationState.loadingGeoLocation) ? 7 : 2));
            setFinishedLoading(true);

            (!currentUserState.isLoggedIn &&
                openSnackbar('Tip: zoom in and out to find more locations.', 'info', 25000));
        }
    }, [locationState]);

    // circular map marker colors
    const primary = '#7986cb';
    const secondary = '#ffac33';
    const size = 35000;

    // a "you are hear" marker to be shown if no nearby locations already exist
    const youAreHereMarker = () => {
        return (
            <Circle
                center={curPos}
                color={secondary}
                radius={size}
                onClick={() => locationDispatch({type: 'setCurrent', payload: -1})}
            />
        );
    };

    const loading = locationState.loadingGeoLocation;

    return (
        <Map center={curPos} zoom={zoom} zoomControl={false} onzoomend={e => setZoom(e.target._zoom)}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {allLocations.map(loc => (
                <Circle
                    key={loc.id}
                    center={[loc.coordinates[0], loc.coordinates[1]]}
                    color={nearLocationData && nearLocationData.includes(loc.id) ? secondary : primary}
                    radius={size}
                    onClick={() => locationDispatch({type: 'setCurrent', payload: loc.id})}
                />
            ))}

            {!loading && nearLocationData.length === 0 && locationState.geoLocationEnabled &&
                youAreHereMarker()
            }

            {loading && 
                <div className={classes.spinnerBox}>
                    <CircularProgress className={classes.spinnerItem}/>
                    <Fade 
                        className={classes.spinnerItem} 
                        in={locationState.geoPermission === 'granted'}
                        timeout={{enter: 500, exit: 500}}
                    >
                        <DoneIcon/> 
                    </Fade>
                </div>
            }

            <CustomZoomControl 
                setZoom={setZoom}
                zoom={zoom}
            />
        </Map>
    );
}