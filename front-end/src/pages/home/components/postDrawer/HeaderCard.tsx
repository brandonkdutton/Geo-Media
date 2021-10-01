import React, { FC } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch } from "../../../../redux/hooks";
import { setOpenId } from "../../../../redux/slices/locationsSlice";
import FilterByTagBar from "./FilterByTagBar";
import { IconButton, CardHeader, Grid, Card, Divider } from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useAppSelector } from "../../../../redux/hooks";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
}));

const HeaderCard: FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const openLocation = useAppSelector(({ locations }) => locations.openId);
  const [fetchPending, numPosts] = useAppSelector(({ posts }) => [
    posts.postsFetchPending,
    posts.ids.length,
  ]);

  const headerCardText = (): [string, string] => {
    if (fetchPending) return ["Fetching posts", "Just a moment..."];
    if (openLocation === -2)
      return [
        "You made a new location!",
        "If you've been here before, why not post a bit about it?",
      ];
    else if (numPosts === 0)
      return ["Looks like nobody has posted here yet.", "Be the first?"];
    else
      return [
        "Looks like someone's been here recently",
        "If you've been here too, why not post a bit about it?",
      ];
  };

  const [header, subheader] = headerCardText();

  return (
    <Card className={classes.root}>
      <Grid container direction="column">
        <Grid item container justify="space-between">
          <Grid item>
            <CardHeader title={header} subheader={subheader} />
          </Grid>
          <Grid item>
            <IconButton>
              <CloseRoundedIcon onClick={() => dispatch(setOpenId(null))} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <Divider />
          <FilterByTagBar />
        </Grid>
      </Grid>
      {fetchPending && <LinearProgress />}
    </Card>
  );
};

export default HeaderCard;
