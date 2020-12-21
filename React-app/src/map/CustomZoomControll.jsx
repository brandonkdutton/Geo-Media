import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: 501,
        pointerEvents: 'none'
    },
    paper: {
        padding: theme.spacing(1),
        pointerEvents: 'auto',
    },
}));

const CustomZoomControl = (props) => {

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    // no zoom controll is needed on mobile devices
    if(isMobile) {
        return (null);
    }

    return (
        <Grid container spacing={3} justify={'flex-end'} alignItems={'flex-end'} className={classes.root}>
            <Grid item>
                <Paper className={classes.paper}>
                    <Grid container direction={'column'} justify={'center'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <IconButton onClick={() => props.setZoom(props.zoom + 1)}>
                                <ZoomInIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => props.setZoom(props.zoom - 1)}>
                                <ZoomOutIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );

};

export default CustomZoomControl;