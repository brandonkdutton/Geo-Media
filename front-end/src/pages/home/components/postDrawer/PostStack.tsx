import React, { FC, useState, RefObject } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import HeaderCard from "./HeaderCard";
import PostWithReplies from "./PostWithReplies";
import WriteCard from "./WriteCard";
import { useAppSelector } from "../../../../redux/hooks";
import { selectPostIdsForCurrentLocation } from "../../../../redux/slices/postsSlice";
import { EntityId } from "@reduxjs/toolkit";
import { RefMap } from "../../../../types/postTypes";

const useStyles = makeStyles((theme) => ({
  spinnerCard: {
    width: "100%",
  },
  spinnerCardContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  marginStyle: {
    paddingLeft: "8px",
    paddingRight: "16px",
    boxSizing: "border-box",
  },
}));

const PostStack: FC = () => {
  const classes = useStyles();
  const postIds: EntityId[] = useAppSelector(selectPostIdsForCurrentLocation);
  const [postsFetchPending, replyingToId] = useAppSelector(({ posts }) => [
    posts.postsFetchPending,
    posts.replyingToId,
  ]);
  const [refMap, setRefMap] = useState<RefMap>({});

  const scrollToPostById = (id: EntityId): void => {
    if (!refMap || !(id in refMap)) return;
    const ref = refMap[id];
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  };

  const upsertRefMap = (id: EntityId, ref: RefObject<HTMLDivElement>): void => {
    setRefMap((state: RefMap) => {
      return {
        ...state,
        [id]: ref,
      };
    });
  };

  const removeFromRefMap = (id: EntityId) => {
    setRefMap((state: RefMap) => {
      const newState = Object.assign({}, state);
      delete newState[id];
      return newState;
    });
  };

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
        <HeaderCard />
      </Grid>
      {!postsFetchPending &&
        postIds.map((postId: EntityId) => (
          <PostWithReplies
            postId={postId}
            key={postId}
            upsertRefMap={upsertRefMap}
            removeFromRefMap={removeFromRefMap}
            scrollToPostById={scrollToPostById}
            refMap={refMap}
          />
        ))}
      <Grid item style={{ width: "100%" }}>
        <WriteCard
          scrollToPostById={scrollToPostById}
          refMap={refMap}
          type="post"
        />
      </Grid>
    </Grid>
  );
};

export default PostStack;
