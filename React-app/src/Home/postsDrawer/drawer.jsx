import React, { useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PostStack from './PostStack';

import { locationContext } from '../reducerContextWrappers/LocationContextWrapper';

const drawerWidth = '40%';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        flexShrink: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth
        },
    },
    drawerPaper: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth
        },
        backgroundColor: 'transparent',
        border: 'none',
        pointerEvents: 'none',
    },
    allowPointerEvents: {
        pointerEvents: 'auto',
        overflowY: 'auto',
    },
}
));


export default function PersistentDrawerLeft(props) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // used to check if drawer should be open or not. ie. if current location id is not null
    const { locationState } = useContext(locationContext);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor={isMobile ? 'bottom' : 'left'}
                open={locationState.current !== null}
                classes={{ paper: classes.drawerPaper }}
            >
                <div className={classes.allowPointerEvents}>
                    <List>
                        <Collapse in={locationState.current !== null && props.postsToShow}>

                            {/* posts object is passed in props because it's conveniant for recursiveley rendering the post stack */}
                            <PostStack
                                postsToShow={props.postsToShow}
                            />
                        </Collapse>
                    </List>
                </div>
            </Drawer>

        </div>
    );
}
