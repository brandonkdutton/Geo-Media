/*
    This is a wrapper that wraps the Home componant with all its context wrappers and providers
 */

import React, { createContext } from "react";
import Home from "../Home";

import LocationContextWrapper from "./LocationContextWrapper";
import PostContextWrapper from "../reducerContextWrappers/ExpandedContextWrapper";
import ReplyingToContextWrapper from "../reducerContextWrappers/ReplyingToContextWrapper";
import PostsContextWrapper from "../reducerContextWrappers/PostsContextWrapper";

// gives react-router render props to all the sub-componants for stuff like history manipulation
const routerPropsContext = createContext(null);

export default function HomeWrapper(props) {
  return (
    <PostContextWrapper>
      <ReplyingToContextWrapper>
        <LocationContextWrapper>
          <PostsContextWrapper>
            <routerPropsContext.Provider value={props}>
              <Home />
            </routerPropsContext.Provider>
          </PostsContextWrapper>
        </LocationContextWrapper>
      </ReplyingToContextWrapper>
    </PostContextWrapper>
  );
}

export { routerPropsContext };
