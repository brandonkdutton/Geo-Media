import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { currentUserContext } from "./CurrentUserContextWrapper";
import { globalSnackbarContext } from "../GlobalSnackbarWrapper";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: "100vh",
    width: "100wh",
  },
  paper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    padding: theme.spacing(1),
  },
  errorText: {
    color: theme.palette.error.main,
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [message, setMessage] = useState("");

  const { currentUserDispatch } = useContext(
    currentUserContext
  );
  const openSnackbar = useContext(globalSnackbarContext);

  // attempts to dispatch a login action.
  // redirects to home page on success, shows error on rejection
  const onSubmit = () => {
    if (!username || !password) {
      setMessage("Missing username or password");
      setError(true);
    } else {
      setError(false);
      setLoggingIn(true);
      setMessage("");

      // promise handles success or rejection of login dispatch
      new Promise((resolve, reject) => {
        currentUserDispatch({
          type: "login",
          payload: {
            username,
            password,
            resolve,
            reject,
          },
        });
      })
        .then((updatedState) => {
          openSnackbar(`Successfully logged in as ${username}`, "success");
          props.history.push("/");
        })
        .catch((error) => {
          setLoggingIn(false);
          setError(true);
          setMessage(error);
        });
    }
  };

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.gridContainer}
    >
      <Grid item>
        <Typography variant="h6">Login</Typography>
      </Grid>

      {error !== "" && (
        <Grid item>
          <Typography className={error ? classes.errorText : null}>
            {message}
          </Typography>
        </Grid>
      )}

      {loggingIn && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      <Grid item>
        <TextField
          type="text"
          placeholder="Username"
          autoFocus={true}
          disabled={loggingIn}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Grid>

      <Grid item>
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          disabled={loggingIn}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>

      <Grid item>
        <Button variant="outlined" onClick={onSubmit} disabled={loggingIn}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
