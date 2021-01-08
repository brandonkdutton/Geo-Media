/* 
    - Context higher order componant
    - Passes a list of all the posts who's comment sections are expanded
    - Passes a reducer dispatch function to add and remove id's from the list
    - Wraps the PostStack componant
 */

import React, { createContext, useReducer } from "react";

const expandedPostsContext = createContext(null);

/* The HOC Componant */
const Wrapper = (props) => {
  const initialState = [-1]; // -1 is probably not needed. but it's here just in case

  const reducer = (initialState, action) => {
    switch (action.type) {
      // add an id to the list
      case "add":
        return (() => {
          const copy = initialState.slice();
          copy.push(action.payload);
          return copy;
        })();

      // remove an id from the list
      case "remove":
        return (() => {
          const copy = initialState.slice();
          return copy.filter((x) => x !== action.payload);
        })();

      // return the list unchanged
      default:
        return initialState;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // object containing the state and reducer to be passed down the context
  const contextVal = {
    expandedState: state,
    expandedDispatch: dispatch,
  };

  return (
    <expandedPostsContext.Provider value={contextVal}>
      {props.children}
    </expandedPostsContext.Provider>
  );
};

// export all context vars
export { expandedPostsContext };

export default Wrapper;
