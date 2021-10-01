import React, { FC } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/thunks/sessionThunks";
import { Link } from "react-router-dom";

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

const AvatarButton: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentUser = useAppSelector(({ session }) => session.user);
  const sessionFetchPending = useAppSelector(({ session }) => session.pending);
  const dispatch = useAppDispatch();

  return (
    <Grid container className={classes.root} justify={"flex-end"}>
      <Grid item xs={12} sm={4}>
        <div className={classes.slideContainer}>
          <Paper className={classes.paperStyle}>
            {!sessionFetchPending ? (
              currentUser ? (
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
                      className={classes.enablePointerEvents}
                      onClick={() => dispatch(logout(null))}
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
                      <Typography>{currentUser.username}</Typography>
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
                      className={classes.enablePointerEvents}
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      className={classes.enablePointerEvents}
                      component={Link}
                      to="/login"
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
};

export default AvatarButton;
