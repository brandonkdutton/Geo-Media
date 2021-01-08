import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import CircularProgress from "@material-ui/core/CircularProgress";

// context imports
import { replyingToContext } from "../reducerContextWrappers/ReplyingToContextWrapper";
import { locationContext } from "../reducerContextWrappers/LocationContextWrapper";
import { postsContext } from "../reducerContextWrappers/PostsContextWrapper";
import { currentUserContext } from "../../users/CurrentUserContextWrapper";
import { globalSnackbarContext } from "../../GlobalSnackbarWrapper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  textArea: {
    width: "100%",
    resize: "none",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    marginBottom: "-16px",
    padding: "8px",
    maximumScale: 1,
  },
  nameArea: {
    width: "66%",
    marginBottom: "8px",
    padding: "8px",
    resize: "none",
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
  },
  spinnerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function WriteCard(props) {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [posting, setPosting] = useState();

  const { post_id } = props.postObj;

  const { replyingToState, replyingToDispatch } = useContext(replyingToContext);
  const { locationState, locationDispatch } = useContext(locationContext);
  const { postsDispatch } = useContext(postsContext);
  const { currentUserState } = useContext(currentUserContext);
  const openSnackbar = useContext(globalSnackbarContext);

  const canPostToThisLocation =
    locationState.near.includes(locationState.current) ||
    (locationState.near.length === 0 && locationState.current === -1);
  const replyingToThisPost = replyingToState === post_id;
  const isLoggedIn = currentUserState.isLoggedIn;

  // helper function dispatches an action to add the a post to the current location
  const addPostToLocation = (locId, parentId, content) => {
    new Promise((onResolve, onReject) => {
      postsDispatch({
        type: "addPostToLoc",
        payload: {
          locId: locId,
          parentId: parentId,
          content: content,
          userId: currentUserState.userId,
          onResolve: onResolve,
          onReject: onReject,
        },
      });
    })
      .then(() => {
        postsDispatch({ type: "getAllFromLocId", payload: { locId: locId } });
      })
      .catch(error => {
        openSnackbar(`Error: ${error}`, "error");
      })
      .finally(() => {
        setPosting(false);
        setText("");
        if (replyingToThisPost)
          replyingToDispatch({ type: "set", payload: null });
      });
  };

  // validates form, sets the spinner, dispatches the api call to add a post
  const onPostButtonClicked = () => {
    if (!currentUserState.isLoggedIn)
      return openSnackbar("You must be logged in to post", "error");
    else if (text === "") return openSnackbar("Posts cannot be empty", "error");
    else if (text.length > 511) {
      return openSnackbar("Posts are limited to 512 characters.", "error");
    }

    setPosting(true);
    const parentId = post_id;
    if (locationState.current === -1) {
      new Promise((onResolve, onReject) => {
        locationDispatch({
          type: "createNew",
          payload: {
            coords: locationState.geoLocation,
            onResolve: onResolve,
            onReject: onReject,
          },
        });
      })
        .then(result => {
          addPostToLocation(result.current, parentId, text);
        })
        .catch(error => {
          openSnackbar(`Error: ${error}`, "error");
        });
    } else {
      addPostToLocation(locationState.current, parentId, text);
    }
  };

  return (
    <Card className={classes.root}>
      {!posting ? (
        <>
          <CardContent>
            <TextareaAutosize
              className={classes.textArea}
              disabled={!isLoggedIn || !canPostToThisLocation}
              rowsMin={4}
              value={text}
              placeholder={
                !canPostToThisLocation
                  ? "Too far away to post..."
                  : isLoggedIn
                  ? "Your post content..."
                  : "Login to post..."
              }
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
          <CardActions disableSpacing>
            <Button
              onClick={onPostButtonClicked}
              disabled={!isLoggedIn || !canPostToThisLocation}
            >
              {!canPostToThisLocation
                ? "Too far away to post"
                : isLoggedIn
                ? "Post"
                : "Login to Post"}
            </Button>
          </CardActions>
        </>
      ) : (
        <CardContent className={classes.spinnerBox}>
          <CircularProgress />
        </CardContent>
      )}
    </Card>
  );
}
