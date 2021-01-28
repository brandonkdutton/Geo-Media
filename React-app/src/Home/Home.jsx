import React, { useState, useContext, useEffect } from "react";
import Drawer from "./postsDrawer/Drawer";
import Map from "../map/Map";
import LoadingPage from "./LoadingPage";
import UserAvatarButton from "../users/AvatarButton";
import { locationContext } from "./reducerContextWrappers/LocationContextWrapper";
import { postsContext } from "./reducerContextWrappers/PostsContextWrapper";
import { currentUserContext } from "../users/CurrentUserContextWrapper";

export default function Home() {
  const { locationState, locationDispatch } = useContext(locationContext);
  const { postsState, postsDispatch } = useContext(postsContext);
  const { currentUserDispatch } = useContext(currentUserContext);
  const [doneFetchingUserData, setDoneFetchingUserData] = useState(false);
  const loading = locationState.loadingGeoLocation;

  // fetch initial geolocation and list of all existing location ids
  // also fetches list of near location id's once updateGeo dispatch has finished
  useEffect(() => {
    if (!locationState.geoBypass) {
      new Promise((onResolve) => {
        locationDispatch({ type: "updateGeo", payload: { onResolve } });
      }).then((res) => {
        locationDispatch({ type: "updateNear", payload: res.geoLocation });
      });
    }

    locationDispatch({ type: "updateAll", payload: null });

    // fetched logged in user data using a jwt token in local storage.
    // set state to true when an attempt to fetch is complete regardless of outcome
    new Promise((onResolve, onReject) => {
      currentUserDispatch({
        type: "getUserData",
        payload: { onResolve, onReject },
      });
    }).finally(() => {
      setDoneFetchingUserData(true);
    });
  }, []);

  // keeps track of last fetched post id to prevent duplicate fetches. -2 is default because it will never occur naturally
  const [lastPostsId, setLastsPostsId] = useState(-2);

  // refreshes the current post data whenever the current post id changes and is not null
  useEffect(() => {
    if (locationState.current && lastPostsId !== locationState.current) {
      postsDispatch({
        type: "getAllFromLocId",
        payload: {
          locId: locationState.current,
        },
      });
      setLastsPostsId(locationState.current);
    }
  }, [locationState]);

  return (
    <>
      {!loading ? (
        <>
          <UserAvatarButton doneFetchingUserData={doneFetchingUserData} />
          <Drawer postsToShow={postsState.posts} />
          <Map />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
