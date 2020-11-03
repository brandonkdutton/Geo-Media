import React, { createContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PostStack from './PostStack';

// context imports
import PostContextWrapper from '../ExpandedContextWrapper';
import ReplyingToContextWrapper from '../ReplyingToContextWrapper';
import { locationIdContext, addPostFncContext, nearLocationIdsContext } from '../nonReducerContexts';

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

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor={isMobile ? 'bottom' : 'left'}
                open={props.drawerState}
                classes={{ paper: classes.drawerPaper}}
            >
                <div className={classes.allowPointerEvents}>
                    <List>
                        <Collapse in={true}>

                            {/* Pass all contexts down the post stack */}
                            <PostContextWrapper>
                                <ReplyingToContextWrapper>
                                    <locationIdContext.Provider value={props.locationId}>
                                        <addPostFncContext.Provider value={props.addPostFnc}>
                                            <nearLocationIdsContext.Provider value={props.nearLocationIds}>

                                                <PostStack
                                                    postsToShow={props.postsToShow}
                                                    handleDrawer={props.handleDrawer}
                                                    closeDrawer={props.closeDrawer}
                                                />
                                                
                                            </nearLocationIdsContext.Provider>
                                        </addPostFncContext.Provider>
                                    </locationIdContext.Provider>
                                </ReplyingToContextWrapper>
                            </PostContextWrapper>

                        </Collapse>
                    </List>
                </div>
            </Drawer>

        </div>
    );
}
