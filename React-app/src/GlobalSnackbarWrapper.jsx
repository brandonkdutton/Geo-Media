/*
    - Context higher order component which wraps the entire app from inside App.jsx
    - Provides entire app with a function to trigger a snackbar notification via context.
*/

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import React, { createContext, useState } from "react";

const globalSnackbarContext = createContext(null);

// the HOC to provide the reducer context
const GlobalSnackbarWrapper = (props) => {
  const defaultDuration = 6000;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState(defaultDuration);

  // applies custom styling to the mui alert component
  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const handleOpen = (message, severity, duration = defaultDuration) => {
    if (open || !message || !severity) return;

    setSeverity(severity);
    setMessage(message);
    setDuration(duration);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <globalSnackbarContext.Provider value={handleOpen}>
      {props.children}

      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        ClickAwayListenerProps={{ mouseEvent: "onMouseUp" }}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </globalSnackbarContext.Provider>
  );
};

// export all of the contexts
export { globalSnackbarContext };

export default GlobalSnackbarWrapper;
