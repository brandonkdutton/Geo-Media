import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

// context imports
import { nearLocationIdsContext, locationIdContext } from '../nonReducerContexts';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
    }
}));

export default function BlankCard(props) {
    const classes = useStyles();

    const nearLocationIds = React.useContext(nearLocationIdsContext);
    const locationId = React.useContext(locationIdContext);

    const headerCardText = () => {
        //returns the approapriate message to be shown in the post stack's header card
        if(locationId === -1)
            return "You're the first person to visit this area!";
        if(nearLocationIds.includes(locationId))
            return "You're near enough to post here.";

        return "You're too far away to post here.";
    };

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                <Typography variant='h6'>
                    {headerCardText()}
                </Typography>

                <IconButton>
                    <CloseRoundedIcon onClick={props.closeDrawer}/>
                </IconButton>
            </CardContent>
        </Card>
    );
}
