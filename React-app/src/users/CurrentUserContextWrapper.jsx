/*
    - Acts as a reducer for the global user state
    - Handles async api alls for user related state
 */

import React, { createContext, useReducer, useEffect } from "react";

const currentUserContext = createContext(null);

const middleWare = (dispatch) => {
  return (action) => {
    switch (action.type) {
      // attempt to log the user in via the api. Payload: { username, password, resolve fnc, reject fnc }
      // if successfull, injects username, userId into payload. If failure, rejects dispatch promiss with the error.
      case "login":
        (async () => {
          const uri = `${process.env.REACT_APP_API_BASE_URI}/user/login`;
          const requestBody = {username: action.payload.username, password: action.payload.password};

          const request = await fetch(uri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          const jsonResponse = await request.json();

          if (request.status >= 200 && request.status < 400) {
            const newAction = Object.assign({}, action);
            newAction.payload.jwt = jsonResponse.jwt;
            dispatch(newAction);
          } else {
            action.payload.reject(jsonResponse.error);
          }
        })();
        break;
      // attempts to register a new user via the api. Payload: { username, password, resolve fnc, reject fnc }
      // on success dispatches origional action, on failure rejects dispatch promise with error
      case "register":
        (async () => {
          const uri = `${process.env.REACT_APP_API_BASE_URI}/user/register`;
          const requestBody = {username: action.payload.username, password: action.payload.password};

          const request = await fetch(uri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          const jsonResponse = await request.json();

          if (request.status >= 200 && request.status < 400) {
            dispatch(action);
          } else {
            action.payload.reject(jsonResponse.error);
          }
        })();
        break;
      // checks if a jwt token exists in local storage. If so, attempts to fetch user data from the api
      // then injects resulting json into the payload. if fails, rejects the promise
      case "getUserData":
        (async () => {
          const storedToken = localStorage.getItem("jwt");
          if (storedToken === null) {
            action.payload.onReject("no stored token");
            return;
          }

          const uri = `${process.env.REACT_APP_API_BASE_URI}/user/data`;
          const requestBody = { jwt_token: storedToken };

          const request = await fetch(uri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          const jsonResponse = await request.json();

          if (request.status >= 200 && request.status < 400) {
            const newAction = Object.assign({}, action);
            newAction.payload.userData = jsonResponse;
            dispatch(newAction);
          } else {
            action.payload.onReject(
              `Error: ${jsonResponse['error']}`
            );
          }
        })();
        break;
      // Loggs a user out by deleting their jwt token from local storage.
      // Shows a success snackbar on completion, an error one on failure
      case "logout":
        (() => {
          if (localStorage.getItem("jwt")) {
            localStorage.removeItem("jwt");
            dispatch(action);
          } else {
            action.payload.reject("No user is currentley logged in");
          }
        })();
        break;
      default:
        return dispatch(action);
    }
  };
};

// the HOC to provide the reducer context
const CurrentUserContextWrapper = (props) => {
  // id of the post being replied to.
  const initialState = {
    isLoggedIn: false,
    userId: null,
    username: "",
    onDispatchSuccess: () => null,
  };

  const reducer = (initialState, action) => {
    switch (action.type) {
      // update state with new user data and add jwt token to local storage
      case "login":
        return (() => {
          localStorage.setItem("jwt", action.payload.jwt);
          const newState = Object.assign({}, initialState);
          newState.onDispatchSuccess = action.payload.resolve;
          return newState;
        })();
      // update state with the dispatch resolve function
      case "register":
        return (() => {
          const newState = Object.assign({}, initialState);
          newState.onDispatchSuccess = action.payload.resolve;
          return newState;
        })();
      // updates the state with user data
      case "getUserData":
        return {
          isLoggedIn: true,
          userId: action.payload.userData.id,
          username: action.payload.userData.username,
          onDispatchSuccess: action.payload.onResolve,
        };
      // updates the state to show no user logged in
      case "logout":
        return {
          isLoggedIn: false,
          userId: null,
          username: "",
          onDispatchSuccess: action.payload.resolve,
        };
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // object to provide reducer as context
  const contextVal = {
    currentUserState: state,
    currentUserDispatch: middleWare(dispatch),
  };

  // fullfill any promisses pending on dispatch completion
  useEffect(() => {
    state.onDispatchSuccess(state);
  }, [state]);

  return (
    <currentUserContext.Provider value={contextVal}>
      {props.children}
    </currentUserContext.Provider>
  );
};

// export all of the contexts
export { currentUserContext };

export default CurrentUserContextWrapper;
