/*
    - Renders a card to display the contence of a post
    - Reply and expand buttons use reducers and can change/read
        the expanded and replyingTo contexts
*/

import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { expandedPostsContext } from '../reducerContextWrappers/ExpandedContextWrapper';
import { replyingToContext } from '../reducerContextWrappers/ReplyingToContextWrapper';
import { locationContext } from '../reducerContextWrappers/LocationContextWrapper';
import { currentUserContext } from '../../users/CurrentUserContextWrapper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        backgroundColor: 'transparent',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    actionArea: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '16px',
        paddingRight: '16px',
    }
}));

export default function PostCard(props) {
    const classes = useStyles();

    const { post_id, username, timestamp, content, replies } = props.postObj;
    const { expandedState, expandedDispatch } = useContext(expandedPostsContext);
    const { replyingToState, replyingToDispatch } = useContext(replyingToContext);
    const { locationState } = useContext(locationContext);
    const { currentUserState } = useContext(currentUserContext);

    const thisPostExpanded = expandedState.includes(post_id);
    const replyingToThisPost = replyingToState === post_id;
    const nearEnoughToReply = locationState.near.includes(locationState.current);
    const isLoggedIn = currentUserState.isLoggedIn;

    // toggle expansion/collapse of this post's reply section
    const onExpandButtonClicked = () => {
        if(thisPostExpanded) {
            expandedDispatch({type: 'remove', payload: post_id});
        } else {
            expandedDispatch({type: 'add', payload: post_id});
        }

        // close the reply box when the comment section is collapsed
        if(replyingToThisPost)
            replyingToDispatch({type: 'set', payload: null});
    };

    // toggle replying to this post
    const onReplyButtonClicked = () => {
        if(replyingToThisPost) {
            replyingToDispatch({type: 'set', payload: null});
        } else {
            replyingToDispatch({type: 'set', payload: post_id});
        }

        // expand the post section if it is not already expanded
        if(!thisPostExpanded)
            expandedDispatch({type: 'add', payload: post_id});
    };

    // formats an sql timstamp string into: 'mm/dd/yy, hour:minute(pm/am)
    const toReadableTimestamp = (sqlTimestamp) => {
        const halfs = sqlTimestamp.split(' ');
        const dateFragments = halfs[0].split('-');
        const timeFragments = halfs[1].split(':');
        
        const intHour = parseInt(timeFragments[0]);
        let timeSuffix = 'am';
        if(intHour > 12) {
            timeFragments[0] = (intHour - 12).toString();
            timeSuffix = 'pm';
        }

        const formated = `${dateFragments[1]}/${dateFragments[2]}/${dateFragments[0]} ${timeFragments[0]}:${timeFragments[1]}:${timeFragments[2]} +0000`;
        const inLocalTime = new Date(formated).toLocaleString("en-US");
        return inLocalTime;
    };

    return (
        <>
            <Card className={classes.root}>
                {/* Renders the user pic, username, date, ect. */}
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar}>
                            {username.charAt(0)}
                        </Avatar>
                    }
                    title={username}
                    subheader={toReadableTimestamp(timestamp)}
                />

                {/* Renders the textual content of the post */}
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{content}</Typography>
                </CardContent>

                <CardActions className={classes.actionArea}>
                    {/* Reply button */}
                    <Button disabled={!nearEnoughToReply || !isLoggedIn} onClick={onReplyButtonClicked}>
                        {isLoggedIn ? (replyingToThisPost ? 'Cancel' : 'Reply') : 'Login to Reply'}
                    </Button>

                    {/* Collapse button */}
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: thisPostExpanded,
                        })}
                        disabled={replies.length === 0}
                        onClick={onExpandButtonClicked}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>

            </Card>
        </>
    );
}