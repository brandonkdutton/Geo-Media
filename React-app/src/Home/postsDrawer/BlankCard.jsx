import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography, IconButton } from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

import { locationContext } from "../reducerContextWrappers/LocationContextWrapper";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
  },
}));

export default function BlankCard() {
  const classes = useStyles();

  const { locationState, locationDispatch } = useContext(locationContext);

  //returns the approapriate message to be shown in the post stack's header card
  const headerCardText = () => {
    if (locationState.current === -1)
      return "You're the first person to visit this area!";
    if (locationState.near.includes(locationState.current))
      return "You're near enough to post here.";
    return "You're too far away to post here.";
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography variant="h6">{headerCardText()}</Typography>

        <IconButton>
          <CloseRoundedIcon
            onClick={() =>
              locationDispatch({ type: "setCurrent", payload: null })
            }
          />
        </IconButton>
      </CardContent>
    </Card>
  );
}
