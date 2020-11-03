import React, { useEffect, useState } from 'react';
import { postData } from '../api/requests';

//Hook to fetch location data from the api.
//Functions requiring location data should get it from here
const useLocations = () => {
    const [locations, setLocations] = useState([]);
    const [nearLocIds, setNearLocIds] = useState([]);
    const [curPos, setCurPos] = useState([0,0]);

    useEffect(() => {
        // update list of nearest locations whenever current location changes
        const uri = `${process.env.REACT_APP_API_BASE_URI}/location/near?lat=${curPos[0]}&lon=${curPos[1]}`;
        fetch(uri).then((response) => {
            response.json().then(res => {
                setNearLocIds(res['near_locations']);
            });
        });
    }, [curPos]);


    useEffect(() => {
        // set location data state variable
        const uri = `${process.env.REACT_APP_API_BASE_URI}/location/all`;
        fetch(uri).then((response) => {
            response.json().then((res) =>{
                setLocations(res['locations']);
            });
        });

        // set current location state variable
        navigator.geolocation.getCurrentPosition((pos) => {
            setCurPos([pos.coords.latitude, pos.coords.longitude]);
        });
    },[]);


    const addLocation = async () => {
        // adds a the current location to the database and update the state 
        // with the new location data returns the id of the new location
        const uri = `/location/near?lat=${curPos[0]}&lon=${curPos[1]}`;
        return await postData(uri);
    };

    const actions = { addLocation };
    const hook = { locationData: locations, nearLocIds, ...actions };

    return hook;
};

export { useLocations };