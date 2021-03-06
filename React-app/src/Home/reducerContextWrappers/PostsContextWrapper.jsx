/*
    - Acts as a reducer for Post related global state
    - Handles async api calls related to posts and their dispatches
 */

import React, { createContext, useReducer, useEffect } from "react";

const postsContext = createContext(null);

const middleWare = (dispatch) => {
  return (action) => {
    switch (action.type) {
      // fetch all the posts for a location from the api. Injects the fetched posts into the payload
      case "getAllFromLocId":
        (async () => {
          const uri = `${process.env.REACT_APP_API_BASE_URI}/location/post?loc_id=${action.payload.locId}`;
          const res = await fetch(uri);
          const jsonData = await res.json();

          if (res.status >= 200 && res.status < 400) {
            const newAction = Object.assign({}, action);
            newAction.payload.posts = jsonData["posts"];
            dispatch(newAction);
          } else {
            throw new Error(jsonData["error"]);
          }
        })();
        break;
      // Adds a post to a location based on the location's id and the parent post's id
      // payload args: parentId, content, locationState, locationDispatch
      // no payload modification is necessary as the api returns only the new post's id
      case "addPostToLoc":
        (async () => {
          const { userId, parentId, content, locId } = action.payload;
          const uri = `${process.env.REACT_APP_API_BASE_URI}/location/post?loc_id=${locId}`;

          const res = await fetch(uri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              parent_id: parentId,
              content,
            }),
          });
          const jsonData = await res.json();
          if (res.status >= 200 && res.status < 400) {
            dispatch(action);
          } else {
            action.payload.onReject(jsonData["error"]);
          }
        })();
        break;
      default:
        return dispatch(action);
    }
  };
};

// the HOC to provide the reducer context
const PostsContextWrapper = (props) => {
  // id of the post being replied to.
  const initialState = {
    chachedLocationId: null,
    posts: [],
    onDispatchSuccess: () => null,
  };

  const reducer = (initialState, action) => {
    switch (action.type) {
      // updates the list of all locations fetched form the api
      case "getAllFromLocId":
        return (() => {
          const newState = Object.assign({}, initialState);
          newState.posts = action.payload.posts;
          newState.chachedLocationId = action.payload.locId;
          return newState;
        })();
      // updates the new state with the promise to resolve once the new post has been successfully added
      case "addPostToLoc":
        return (() => {
          const newState = Object.assign({}, initialState);
          newState.onDispatchSuccess = action.payload.onResolve;
          return newState;
        })();

      // do not change replying to id
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // object to provide reducer as context
  const contextVal = {
    postsState: state,
    postsDispatch: middleWare(dispatch),
  };

  // fullfill any promisses pending on dispatch completion
  useEffect(() => {
    state.onDispatchSuccess(state);
  }, [state]);

  return (
    <postsContext.Provider value={contextVal}>
      {props.children}
    </postsContext.Provider>
  );
};

// export all of the contexts
export { postsContext };

export default PostsContextWrapper;
