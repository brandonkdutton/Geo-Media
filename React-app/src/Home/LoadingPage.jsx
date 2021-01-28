import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import { locationContext } from "./reducerContextWrappers/LocationContextWrapper";
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

export default function LoadingPage() {
  const classes = useStyles();
  const { locationState, locationDispatch } = useContext(locationContext);
  const openSnackbar = useContext(globalSnackbarContext);

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
      "If the page is taking a long time to load you may need to enable location services in your device settings. Alternatively you can proceed without geolocation by clicking the link above.",
      "info",
      60000
    );
  };

  return (
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
  );
}
