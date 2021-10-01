import React, { FC, RefObject } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PostCard from "./PostCard";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import WriteCard from "./WriteCard";
import { EntityId } from "@reduxjs/toolkit";
import { selectPostByIdForCurrentLocation } from "../../../../redux/slices/postsSlice";
import { useAppSelector } from "../../../../redux/hooks";
import { Post, Reply } from "../../../../types/postTypes";
import { RefMap, Category } from "../../../../types/postTypes";

const useStyles = makeStyles((theme) => ({
  marginStyle: {
    paddingLeft: "8px",
    paddingRight: "16px",
    boxSizing: "border-box",
  },
}));

interface props {
  postId: EntityId;
  refMap: RefMap;

  upsertRefMap: (id: EntityId, ref: RefObject<HTMLDivElement>) => void;
  removeFromRefMap: (id: EntityId) => void;
  scrollToPostById: (id: EntityId) => void;
}

const PostWithReplies: FC<props> = ({
  postId,
  refMap,
  upsertRefMap,
  removeFromRefMap,
  scrollToPostById,
}) => {
  const classes = useStyles();
  const post: Post | undefined = useAppSelector((state) =>
    selectPostByIdForCurrentLocation(state, postId)
  );
  const replyingToId: number | null = useAppSelector(
    ({ posts }) => posts.replyingToId
  );
  const expandedIds = useAppSelector(({ posts }) => posts.expandedIds);
  const isExpanded = expandedIds.includes(postId as number);
  const replyingToThisPost = replyingToId === postId;

  if (!post) return null;
  else
    return (
      <Grid
        item
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-end"
        spacing={1}
        className={classes.marginStyle}
      >
        <PostCard
          upsertRefMap={upsertRefMap}
          removeFromRefMap={removeFromRefMap}
          refPrefix="post"
          post={post}
          isExpanded={isExpanded}
        />
        <Grid
          item
          style={{
            width: "95%",
            marginBottom: replyingToThisPost ? "0px" : "-8px",
          }}
        >
          <Collapse in={replyingToThisPost} timeout="auto" unmountOnExit>
            <WriteCard
              scrollToPostById={scrollToPostById}
              refMap={refMap}
              type="reply"
              postId={postId as number}
            />
          </Collapse>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-end"
          spacing={1}
        >
          <Grid
            item
            style={{ width: "95%", marginBottom: isExpanded ? "0px" : "-8px" }}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-end"
                spacing={1}
              >
                {post.replies.map((reply: Reply) => (
                  <PostCard
                    upsertRefMap={upsertRefMap}
                    removeFromRefMap={removeFromRefMap}
                    refPrefix="reply"
                    key={reply.replyId}
                    reply={reply}
                  />
                ))}
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default PostWithReplies;
