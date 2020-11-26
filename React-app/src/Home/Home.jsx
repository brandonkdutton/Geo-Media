import React, { useState, useContext, useEffect } from 'react';
import Drawer from './postsDrawer/drawer';
import Map from '../map/Map';
import { locationContext } from './reducerContextWrappers/LocationContextWrapper';
import { postsContext } from './reducerContextWrappers/PostsContextWrapper';

export default function Home(props) {
    const { locationState, locationDispatch } = useContext(locationContext);
    const { postsState, postsDispatch } = useContext(postsContext);

    // fetch initial geolocation and list of all existing location ids
    // also fetchs list of near location id's once updateGeo dispatch has finished
    useEffect(() => {
        new Promise((onResolve) => {
            locationDispatch({type: 'updateGeo', payload: {onResolve}});
        }).then(res => {
            locationDispatch({type: 'updateNear', payload: res.geoLocation});
        });
        locationDispatch({type: 'updateAll', payload: null});
    },[]);

    // keeps track of last fetched post id to prevent duplicate fetches. -2 is default because it will never occure naturally
    const [lastPostsId, setLastsPostsId] = useState(-2);

    // refreshes the current post data whenever the current post id changes and is not null
    useEffect(() => {
        if (locationState.current && lastPostsId !== locationState.current) {
            postsDispatch({type: 'getAllFromLocId', payload: {
                locId: locationState.current
            }});
            setLastsPostsId(locationState.current);
        }
    },[locationState]);

    return (
        <>
            <Drawer postsToShow={postsState.posts}/>
            <Map/>
        </>
    );

}