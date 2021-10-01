import React, { useState, FC, useEffect, memo } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import LinearProgress from "@material-ui/core/LinearProgress";
import AssignTagsBar from "./AssignTagsBar";

import { createNewCategory } from "../../../../redux/thunks/categoriesThunks";
import {
  postPostsForLocation,
  postReplyForLocation,
} from "../../../../redux/thunks/postsThunks";
import {
  setReplyingToId,
  addToExpanded,
} from "../../../../redux/slices/postsSlice";
import { createLocation } from "../../../../redux/thunks/locationsThunks";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import {
  Category,
  PostToCreate,
  Post,
  ReplyToCreate,
  Reply,
  RefMap,
} from "../../../../types/postTypes";
import { Location } from "../../../../types/locationTypes";

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

interface props {
  type: "post" | "reply";
  postId?: number;
  refMap: RefMap;
  scrollToPostById: (id: EntityId) => void;
}

const WriteCard: FC<props> = ({ type, postId, refMap, scrollToPostById }) => {
  const classes = useStyles();
  const [pendingTag, setPendingTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Category[]>([]);
  const [latestPost, setLatestPost] = useState<EntityId>();
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ session }) => session.user);
  const [posting, replying] = useAppSelector(({ posts }) => [
    posts.postPostPending,
    posts.postReplyPending,
  ]);
  const creatingTag = useAppSelector(
    ({ categories }) => categories.createPending
  );
  const [locId, currentGeoLocation, creating, unconfirmedLoc] = useAppSelector(
    ({ locations }) => [
      locations.openId,
      locations.geolocation,
      locations.postCreatePending,
      locations.unconfirmedLocation,
    ]
  );

  const selectTag = (tag: Category): void => {
    setSelectedTags((oldSelected) => {
      if (oldSelected.includes(tag)) return oldSelected;

      const newSelected = oldSelected.slice();
      newSelected.unshift(tag);
      return newSelected;
    });
  };

  const deselectTag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Category
  ): void => {
    e.stopPropagation();
    setSelectedTags((oldSelected) => {
      return oldSelected.filter((t) => t !== tag);
    });
  };

  const addPendingTag = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): Promise<void> => {
    e.stopPropagation();
    const result = await dispatch(createNewCategory(pendingTag));
    if (result.meta.requestStatus === "fulfilled") {
      setPendingTag("");
      selectTag(result.payload as Category);
    }
  };

  const handlePostSubmit = async (): Promise<void> => {
    // creating a new location
    let currentLocId = locId;
    if ((locId as number) < 1) {
      const coords = locId === -1 ? currentGeoLocation : unconfirmedLoc;
      const newLocation = await dispatch(createLocation(coords));

      if (newLocation.meta.requestStatus === "fulfilled")
        currentLocId = (newLocation.payload as Location).id;
    }

    const postToCreate: PostToCreate = {
      title: "null",
      locId: currentLocId as number,
      content: text,
      categories: selectedTags.map((tag) => tag.id),
    };
    const actionPayload = await dispatch(postPostsForLocation(postToCreate));

    if (actionPayload.meta.requestStatus === "fulfilled") {
      setText("");
      setSelectedTags([]);
      setPendingTag("");
      const postRefId = `post_${(actionPayload.payload as Post).postId}`;
      setLatestPost(postRefId);
    }
  };

  const handleReplySubmit = async (): Promise<void> => {
    const replyToCreate: ReplyToCreate = {
      postId: postId!,
      content: text,
    };

    const newReply = await dispatch(postReplyForLocation(replyToCreate));
    if (newReply.meta.requestStatus === "fulfilled") {
      dispatch(addToExpanded(postId!));
      setText("");
      dispatch(setReplyingToId(null));
      const postRefId = `reply_${(newReply.payload as Reply).replyId}`;
      setLatestPost(postRefId);
    }
  };

  useEffect(() => {
    if (latestPost && latestPost in refMap) {
      setTimeout(() => {
        scrollToPostById(latestPost);
        setLatestPost(undefined);
      }, 500);
    }
  }, [refMap, latestPost, scrollToPostById]);

  const pending =
    type === "post" ? posting || creating || creatingTag : replying;

  return (
    <Card className={classes.root}>
      {pending && <LinearProgress />}
      {type === "post" && (
        <AssignTagsBar
          pendingTag={pendingTag}
          selectedTags={selectedTags}
          addPendingTag={addPendingTag}
          selectTag={selectTag}
          setPendingTag={setPendingTag}
          deselectTag={deselectTag}
        />
      )}
      <CardContent>
        <TextareaAutosize
          disabled={pending}
          className={classes.textArea}
          placeholder="post content"
          rowsMin={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={type === "post" ? handlePostSubmit : handleReplySubmit}
          disabled={!text || pending}
        >
          {user ? `${type}` : `${type} as guest`}
        </Button>
        {!user && (
          <Button component={Link} to="/login" disabled={pending}>
            Login
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default memo(WriteCard);
