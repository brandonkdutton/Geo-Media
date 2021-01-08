import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
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
  errorText: {
    color: theme.palette.error.main,
  },
}));

const Register = (props) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [registering, setLoggingIn] = useState(false);
  const [message, setMessage] = useState("");

  const { currentUserDispatch } = useContext(currentUserContext);
  const openSnackbar = useContext(globalSnackbarContext);

  // attempts to dispatch a register action.
  const onSubmit = () => {
    if (!username || !password || !confirmPassword) {
      setMessage("Missing one or more required fields");
      setError(true);
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setError(true);
    } else {
      setError(false);
      setLoggingIn(true);
      setMessage("");

      // promise handles success or rejection of login dispatch
      new Promise((resolve, reject) => {
        currentUserDispatch({
          type: "register",
          payload: {
            username,
            password,
            resolve,
            reject,
          },
        });
      })
        .then(() => {
          openSnackbar(
            "Registration successfull. You may now login.",
            "success"
          );
          props.history.push("/login");
          // if failure shows error message
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
      alignItems="center"
      justify="center"
      className={classes.gridContainer}
    >
      <Grid item>
        <Typography variant="h6">Register</Typography>
      </Grid>

      {error !== "" && (
        <Grid item>
          <Typography className={error ? classes.errorText : null}>
            {message}
          </Typography>
        </Grid>
      )}

      {registering && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}

      <Grid item>
        <TextField
          type="text"
          placeholder="Username"
          autoFocus={true}
          disabled={registering}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Grid>

      <Grid item>
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          disabled={registering}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>

      <Grid item>
        <TextField
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          disabled={registering}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Grid>

      <Grid item>
        <Button variant="outlined" onClick={onSubmit} disabled={registering}>
          Register
        </Button>
      </Grid>
    </Grid>
  );
};

export default Register;
