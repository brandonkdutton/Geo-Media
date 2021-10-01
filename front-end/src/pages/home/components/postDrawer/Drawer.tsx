import React, { FC } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PostStack from "./PostStack";

const drawerWidth = "40%";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    flexShrink: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
    },
  },
  drawerPaper: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
    },
    backgroundColor: "transparent",
    border: "none",
    pointerEvents: "none",
  },
  allowPointerEvents: {
    pointerEvents: "auto",
    overflowY: "auto",
    overflowX: "hidden",
    marginTop: theme.spacing(1),
  },
}));

const DrawerWrapper: FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const openId: number | null = useAppSelector(
    (state: RootState) => state.locations.openId
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor={isMobile ? "bottom" : "left"}
        open={Boolean(openId)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.allowPointerEvents}>
          <PostStack />
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerWrapper;
