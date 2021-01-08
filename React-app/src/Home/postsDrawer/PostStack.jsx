/*
    - Recursiveley renders the posts in their indented structure
*/
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import HeaderCard from "./BlankCard";
import PostCard from "./PostCard";
import WriteCard from "./WriteCard";
import Dropper from "./PostStackDropper";

import { replyingToContext } from "../reducerContextWrappers/ReplyingToContextWrapper";
import { locationContext } from "../reducerContextWrappers/LocationContextWrapper";
import { postsContext } from "../reducerContextWrappers/PostsContextWrapper";

const useStyles = makeStyles(() => ({
  marginStyle: {
    paddingLeft: "8px",
    paddingRight: "16px",
    boxSizing: "border-box",
  },
}));

const PostStack = (props) => {
  const classes = useStyles();
  const shrinkFactor = 0.95;

  const { replyingToState } = useContext(replyingToContext);
  const { locationState } = useContext(locationContext);
  const { postsState } = useContext(postsContext);

  // true if current geolocation is near enough to post to this location
  const canPostToThisLocation = locationState.near.includes(
    locationState.current
  );

  const generatePosts = (postObj, width = 100) => {
    const replyingToBaseCasePost =
      replyingToState === postObj.post_id && canPostToThisLocation;

    // this is the base case for the recursive generatePosts function
    if (postObj.replies.length === 0) {
      return (
        <>
          {/* The post to render */}
          <Grid item style={{ width: `${width}%` }}>
            <PostCard postObj={postObj} />
          </Grid>

          {/* The root post's collapsable WriteCard. Collapsed when not replying to the post */}
          <Grid
            item
            style={{
              width: `${width * shrinkFactor}%`,
              marginBottom: replyingToBaseCasePost ? "0px" : "-8px",
            }}
          >
            <Collapse in={replyingToBaseCasePost} timeout="auto" unmountOnExit>
              <WriteCard postObj={postObj} />
            </Collapse>
          </Grid>
        </>
      );
    }

    {
      /* Recursive rendering of non-root and not-base-case post cards */
    }
    return (
      <Dropper
        width={width}
        postObj={postObj}
        shrinkFactor={shrinkFactor}
        generatePosts={generatePosts}
      />
    );
  };

  const postsLoadedForThisLocation =
    postsState.chachedLocationId === locationState.current ||
    locationState.current === null;
  const replyingToRootPost =
    (replyingToState === null && canPostToThisLocation) ||
    (locationState.near.length === 0 && locationState.current === -1);

  if (!postsLoadedForThisLocation) {
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-end"
        spacing={1}
        className={classes.marginStyle}
      >
        <Grid item style={{ width: "100%" }}>
          <Card style={{ width: "100%", textAlign: "center", padding: "12px" }}>
            <CircularProgress />
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-end"
        spacing={1}
        className={classes.marginStyle}
      >
        {/* The header/title card that is always on top of the post stack */}
        <Grid item style={{ width: "100%" }}>
          <HeaderCard />
        </Grid>

        {/* The actual stack of posts */}
        {props.postsToShow.map((rootPost) => generatePosts(rootPost))}

        {/* The writecard that always sits at the bottom of the post stack */}
        <Grid
          item
          style={{
            width: `100%`,
            marginBottom: replyingToRootPost ? "0px" : "-8px",
          }}
        >
          <Collapse
            in={postsLoadedForThisLocation}
            timeout="auto"
            unmountOnExit
          >
            <WriteCard postObj={{ post_id: -1 }} />
          </Collapse>
        </Grid>
      </Grid>
    );
  }
};

export default PostStack;
