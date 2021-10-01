import React, { FC, useEffect, RefObject, useRef } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Post, Reply } from "../../../../types/postTypes";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setReplyingToId,
  addToExpanded,
  removeFromExpanded,
} from "../../../../redux/slices/postsSlice";
import CategoriesBar from "./CategoriesBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    backgroundColor: "transparent",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  actionArea: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
}));

interface props {
  post?: Post;
  reply?: Reply;
  isExpanded?: boolean;
  refPrefix: "post" | "reply";
  upsertRefMap: (id: EntityId, ref: RefObject<HTMLDivElement>) => void;
  removeFromRefMap: (id: EntityId) => void;
}

const PostCard: FC<props> = ({
  post,
  reply,
  isExpanded,
  refPrefix,
  upsertRefMap,
  removeFromRefMap,
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = `${refPrefix}_${(post?.postId ?? reply?.replyId)!}`;
    if (ref) upsertRefMap(id, ref);
    return () => removeFromRefMap(id);
  }, [ref]);

  const replyingToId = useAppSelector(({ posts }) => posts.replyingToId);
  const replyingToThisPost = post && replyingToId === post.postId;

  const onExpandButtonClicked = (postId: number) => {
    if (isExpanded) dispatch(removeFromExpanded(postId));
    else dispatch(addToExpanded(postId));
  };

  const onReplyButtonClicked = (postId: number): void => {
    const idToSet = replyingToThisPost ? null : postId;
    dispatch(setReplyingToId(idToSet));
  };

  if (!post && !reply) return null;
  else
    return (
      <Grid item ref={ref} style={{ width: "100%" }}>
        <Card className={classes.root}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <CardHeader
                avatar={
                  <Avatar className={classes.avatar}>
                    {(post ?? reply)!.userName.charAt(0)}
                  </Avatar>
                }
                title={(post ?? reply)!.userName}
                subheader={(post ?? reply)!.createdAt}
              />
            </Grid>
            {post && <CategoriesBar categories={post.categories} />}
          </Grid>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {post?.postContent ?? reply?.replyContent}
            </Typography>
          </CardContent>
          {post && (
            <CardActions className={classes.actionArea}>
              <Button
                disabled={false}
                onClick={() => onReplyButtonClicked(post.postId)}
              >
                {replyingToThisPost ? "Cancel" : "Reply"}
              </Button>
              <IconButton
                onClick={() => onExpandButtonClicked(post.postId)}
                disabled={post?.replies?.length <= 0}
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
          )}
        </Card>
      </Grid>
    );
};

export default PostCard;
