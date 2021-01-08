import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "./postsDrawer/Drawer";
import Map from "../map/Map";
import UserAvatarButton from "../users/AvatarButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import { locationContext } from "./reducerContextWrappers/LocationContextWrapper";
import { postsContext } from "./reducerContextWrappers/PostsContextWrapper";
import { currentUserContext } from "../users/CurrentUserContextWrapper";
import { globalSnackbarContext } from "../GlobalSnackbarWrapper";

const useStyles = makeStyles(() => ({
  spinnerBox: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "40px",
  },
  spinnerItem: {
    position: "absolute",
  },
  grid: {
    width: "100%",
    height: "100vh",
    textAlign: "center",
  },
  links: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function Home() {
  const classes = useStyles();
  const { locationState, locationDispatch } = useContext(locationContext);
  const { postsState, postsDispatch } = useContext(postsContext);
  const { currentUserDispatch } = useContext(currentUserContext);
  const openSnackbar = useContext(globalSnackbarContext);

  const [doneFetchingUserData, setDoneFetchingUserData] = useState(false);

  const loading = locationState.loadingGeoLocation;

  // fetch initial geolocation and list of all existing location ids
  // also fetchs list of near location id's once updateGeo dispatch has finished
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

  // keeps track of last fetched post id to prevent duplicate fetches. -2 is default because it will never occure naturally
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

  // bypasses geolocation usage
  const bypass = () => {
    openSnackbar(
      "You may continue without using geolocation, however the app will have limited features.",
      "info",
      20000
    );
    locationDispatch({ type: "bypassGeo", payload: {} });
  };

  const longLoad = () => {
    openSnackbar(
      "If the page is taking a long time to load you may need to enable location services in your device settings. Alternitiveley you can procede without geolocation by clicking the link above.",
      "info",
      60000
    );
  };

  return (
    <>
      {!loading ? (
        <>
          <UserAvatarButton doneFetchingUserData={doneFetchingUserData} />
          <Drawer postsToShow={postsState.posts} />
          <Map />
        </>
      ) : (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
          className={classes.grid}
        >
          <Grid item>
            <div className={classes.spinnerBox}>
              <CircularProgress className={classes.spinnerItem} />
              <Fade
                className={classes.spinnerItem}
                in={locationState.geoPermission === "granted"}
                timeout={{ enter: 500, exit: 500 }}
              >
                <DoneIcon />
              </Fade>
            </div>
          </Grid>
          <Grid item>
            <Typography>Fetching your approximate location.</Typography>
            <Typography>
              Your exact location will be obfuscated to protect your privacy.
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.links}>
              <Link onClick={longLoad}>Page won't load?</Link>
              <Link onClick={bypass}>Continue without geolocation</Link>
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}
