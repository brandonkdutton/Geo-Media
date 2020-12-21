/*
    - Context higher order componant
    - Provedes children with a reducer to track and set which location is currentley being viewed and/or replied to
    - Only one location can be being viewed or be being replied to at one time
    - Intended to wrap the PostStack componant
 */

import React, { createContext, useEffect, useReducer, useState } from 'react';

const locationContext = createContext(null);

const middleWare = (dispatch) => {
    return (action) => {
        switch (action.type) {
            case 'setCurrent':
                dispatch(action);
                break;
            // if browser has geolocaiton enabled, fetches and injects geo coordinates into payload
            // payload: onResolve
            case 'updateGeo':
                (() => {          
                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                            const newAction = Object.assign({}, action);
                            
                            //obfuscate exact coordinates to protect user privacy to within aproximateley +- 1.5 miles
                            const obfuscatedLat = pos.coords.latitude + (Math.floor(Math.random() * 1.5) * (Math.random() < 0.5 ? 1 : -1))/10;
                            const obfuscatedLon = pos.coords.longitude + (Math.floor(Math.random() * 1.5) * (Math.random() < 0.5 ? 1 : -1))/10;

                            newAction.payload.coords = [obfuscatedLat, obfuscatedLon];
                            newAction.payload.geoLocationEnabled = true;
                            newAction.payload.loadingGeoLocation = false;
                            dispatch(newAction);
                            return;
                        }, (error) => {
                            const newAction = Object.assign({}, action);
                            newAction.payload.geoLocationEnabled = false;
                            newAction.payload.loadingGeoLocation = false;
                            dispatch(newAction);
                            return;
                        });
                    } else {
                        alert("Geolocation is not supported by your browser. Some of this app's features won't work without geolocation.");
                        const newAction = Object.assign({}, action);
                        newAction.payload.geoLocationEnabled = false;
                        newAction.payload.loadingGeoLocation = false;
                        dispatch(newAction);
                    }
                })();
                break;
            // fetch list of near location Id's form the api and inject it into the payload
            // payload: geo coordinates of position from which near centered
            case 'updateNear':
                (() => {
                    const [lat, lon] = action.payload;
                    const uri = `${process.env.REACT_APP_API_BASE_URI}/location/near?lat=${lat}&lon=${lon}`;
                    fetch(uri).then((response) => {
                        response.json().then(res => {
                            const newAction = Object.assign({}, action);
                            newAction.payload = res['near_locations'];
                            dispatch(newAction);
                        });
                    });
                })();
                break;
            // fetches a list of all location id's from the api then injects it into payload
            case 'updateAll':
                (() => {
                    const uri = `${process.env.REACT_APP_API_BASE_URI}/location/all`;
                    fetch(uri).then((response) => {
                        response.json().then((res) => {
                            const newAction = Object.assign({}, action);
                            newAction.payload = res['locations'];
                            dispatch(newAction);
                        });
                    });
                })();
                break;
            // adds a new location and injects its id into the payload
            // payload args: coords, onFullfilled, onRegected
            case 'createNew':
                (() => {
                    const [lat, lon] = action.payload.coords;
                    const uri = `${process.env.REACT_APP_API_BASE_URI}/location/near?lat=${lat}&lon=${lon}`;
                    fetch(uri, {method: 'POST'}).then(response => {
                        response.json().then(res => {
                            const newAction = Object.assign({}, action);
                            newAction.payload.locId = res['loc_id'];
                            dispatch(newAction);
                        });
                    });
                })();
                break;
            default:
                return dispatch(action);
        }
    };
};

// the HOC to provide the reducer context
const LocationContextWrapper = (props) => {

    // id of the post being replied to.
    const initialState = {
        current: null,
        geoLocation: [0, 0],
        near: [],
        allLocations: [],
        geoLocationEnabled: false,
        loadingGeoLocation: true,
        geoPermission: 'denied',
        onDispatchSuccess: () => null,
    };

    const reducer = (initialState, action) => {
        switch (action.type) {
            // set the id of the post being replied to
            case 'setCurrent':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.current = action.payload;
                    return newState;
                })();
            // updates the list of nearby locations
            case 'updateNear':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.near = action.payload;
                    return newState;
                })();
            // updates locationState with new geo coordinates and promise to fullfill when update finishes
            case 'updateGeo':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    action.payload.coords && (newState.geoLocation = action.payload.coords);
                    newState.onDispatchSuccess = action.payload.onResolve;
                    newState.geoLocationEnabled = action.payload.geoLocationEnabled;
                    newState.loadingGeoLocation = action.payload.loadingGeoLocation;
                    return newState;
                })();
            // updates the list of all locations fetched form the api
            case 'updateAll':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.allLocations = action.payload;
                    return newState;
                })();
            // updates the state to include the new location id
            // updates: all, current, near
            case 'createNew':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.allLocations.push({
                        id: action.payload.locId, 
                        coordinates: action.payload.coords,
                    });
                    newState.near.push(action.payload.locId);
                    newState.current = action.payload.locId;

                    newState.onDispatchSuccess = action.payload.onResolve;
                    return newState;
                })();
            // updates geolocation permission status
            case 'updageGeoPermission':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.geoPermission = action.payload.permission;
                    return newState;
                })();
            // do not change replying to id
            default:
                return initialState;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    // resoves any promises that are pening the completion of a dispatch action
    // gives state as response because global state takes too long to update
    useEffect(() => {
        state.onDispatchSuccess(state);
    },[state]);

    // updates local state: geoPermission whenever the user updates their geolocation preferences
    // this is used to show or hide the loading spinner and checkmark
    // Note: this is not supported on IOS or by Safari, hence the try/catch
    useEffect(() => {
        if(!navigator.permissions) {
            dispatch({type: 'updageGeoPermission', payload: {permission: 'granted'}});
            return;
        }

        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            result.onchange = event => dispatch({
                type: 'updageGeoPermission',
                payload: {permission: event.target.state}
            });

            // set the initial state 
            dispatch({
                type: 'updageGeoPermission',
                payload: {permission: result.state}
            });
        });
    },[]);

    // object to provide reducer as context
    const contextVal = {
        locationState: state,
        locationDispatch: middleWare(dispatch),
    };

    return (
        <locationContext.Provider value={contextVal}>
            {props.children}
        </locationContext.Provider>
    );


};

// export all of the contexts
export { locationContext };

export default LocationContextWrapper;