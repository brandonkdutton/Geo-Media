import React, { useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { routerPropsContext } from "../Home/reducerContextWrappers/HomeContextWrapper";
import { currentUserContext } from "./CurrentUserContextWrapper";
import { globalSnackbarContext } from "../GlobalSnackbarWrapper";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 501,
    backgroundColor: "transparent",
    position: "fixed",
    pointerEvents: "none",
  },
  largeAvatar: {
    width: "50px",
    height: "50px",
  },
  slideContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(3),
  },
  enablePointerEvents: {
    pointerEvents: "auto",
  },
  centerVertically: {
    display: "flex",
    alignItems: "center",
  },
  paperStyle: {
    marginRight: "25px",
    padding: theme.spacing(1),
  },
  IconButtonOverride: {
    padding: "0px",
  },
}));

export default function AvatarButton(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { history } = useContext(routerPropsContext);
  const { currentUserState, currentUserDispatch } = useContext(
    currentUserContext
  );
  const openSnackbar = useContext(globalSnackbarContext);

  // dispatches the user logout action and shows a snackbar notification indicating the result
  const handleLogout = () => {
    new Promise((resolve, reject) => {
      currentUserDispatch({ type: "logout", payload: { resolve, reject } });
    })
      .then(() => {
        openSnackbar("Logout successfull.", "success", 20000);
      })
      .catch((error) => {
        openSnackbar(error, "warning", 20000);
      });
  };

  // renders a spinner while awaiting attempt to fetch user data from a jwt token
  // if attempt is successfull, renders a user avatar, otherwise renders login and register buttons
  return (
    <Grid container className={classes.root} justify={"flex-end"}>
      <Grid item xs={12} sm={4}>
        <div className={classes.slideContainer}>
          <Paper className={classes.paperStyle}>
            {props.doneFetchingUserData ? (
              currentUserState.isLoggedIn ? (
                <Grid
                  container
                  direction={"row"}
                  justify={"center"}
                  alignItems={"center"}
                  spacing={4}
                >
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleLogout}
                      className={classes.enablePointerEvents}
                    >
                      Logout
                    </Button>
                  </Grid>

                  {!isMobile && (
                    <Grid item style={{ textAlign: "center" }}>
                      <IconButton
                        className={classes.enablePointerEvents}
                        classes={{ root: classes.IconButtonOverride }}
                      >
                        <Avatar />
                      </IconButton>
                      <Typography>{currentUserState.username}</Typography>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Grid
                  container
                  justify={"center"}
                  alignItems="center"
                  spacing={4}
                  style={{ marginRight: "25px" }}
                >
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => history.push("/login")}
                      className={classes.enablePointerEvents}
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => history.push("/register")}
                      className={classes.enablePointerEvents}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              )
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </div>
      </Grid>
    </Grid>
  );
}
