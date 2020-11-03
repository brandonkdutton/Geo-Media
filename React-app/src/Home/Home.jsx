import React, { useState } from 'react';
import Drawer from './postsDrawer/drawer';
import Map from '../map/Map';
import { useLocations } from './locationHook';
import { usePostsFromPostId } from './postHook';

export default function Home(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openId, setOpenId] = useState(-1);

    const { locationData, nearLocIds, addLocation } = useLocations();
    const { postsById, addPostToLocation } = usePostsFromPostId(openId, addLocation);

    const handleDrawerOpen = (locId=null) => {
        if(locId !== openId)
            handleDrawerClose(openId);

        setDrawerOpen(true);
        setOpenId(locId);
    };

    const handleDrawerClose = (locId=null) => {
        setDrawerOpen(false);
        setOpenId(null);
    };

    const handleDrawer = {
        handleDrawerOpen: handleDrawerOpen,
        handleDrawerClose: handleDrawerClose,
    };

    return (
        <>
            <Drawer 
                closeDrawer={() => setDrawerOpen(false)} 
                drawerState={drawerOpen}
                postsToShow={postsById}
                locationId={openId}
                nearLocationIds={nearLocIds}
                addPostFnc={addPostToLocation}
            />
            <Map 
                handleDrawer={handleDrawer} 
                drawerState={drawerOpen} 
                locationData={locationData}
                nearLocIds={nearLocIds}
            />
        </>
    );

}