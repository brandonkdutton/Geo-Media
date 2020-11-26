import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CircularProgress from '@material-ui/core/CircularProgress';

// context imports
import { replyingToContext } from '../reducerContextWrappers/ReplyingToContextWrapper';
import { locationContext } from '../reducerContextWrappers/LocationContextWrapper';
import { postsContext } from '../reducerContextWrappers/PostsContextWrapper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    textArea: {
        width: '100%',
        resize: 'none',
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        marginBottom: '-16px',
        padding: '8px',
    },
    nameArea: {
        width: '66%',
        marginBottom: '8px',
        padding: '8px',
        resize: 'none',
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
    },
    spinnerBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export default function WriteCard(props) {
    const classes = useStyles();

    const [text, setText] = useState('');
    const [posting, setPosting] = useState();

    const { post_id } = props.postObj;

    const { replyingToState, replyingToDispatch } = useContext(replyingToContext);
    const { locationState, locationDispatch } = useContext(locationContext);
    const { postsDispatch } = useContext(postsContext);

    const replyingToThisPost = replyingToState === post_id;

     // helper function dispatches an action to add the a post to the current location
     const addPostToLocation = async (locId, parentId, content) => {
        await new Promise((onResolve, onReject) => {
            postsDispatch({
                type: 'addPostToLoc', payload: {
                    locId: locId,
                    parentId: parentId,
                    content: content,
                    onResolve: onResolve,
                }
            });
        });

        // refresh posts with new posts from the api
        postsDispatch({type: 'getAllFromLocId', payload: {locId: locId}});

        // clean up writecard
        setPosting(false);
        setText('');
        if (replyingToThisPost)
            replyingToDispatch({ type: 'set', payload: null });
    };

    // validates form, sets the spinner, dispatches the api call to add a post
    const onPostButtonClicked = async () => {
        if (text === '')
            return alert('Your post must have content');

        setPosting(true);
        const parentId = post_id;

        // if the post location has not been added yet, add it before adding post
        if (locationState.current === -1) {
            // await creation of new location
            new Promise((onResolve, onReject) => {
                locationDispatch({
                    type: 'createNew', payload: {
                        coords: locationState.geoLocation,
                        onResolve: onResolve,
                        onReject: onReject
                    }
                });
            })
            // add post to new location
            .then(res1 => addPostToLocation(res1.current, parentId, text));        
        } else {
            addPostToLocation(locationState.current, parentId, text);
        }
    };

    return (
        <Card className={classes.root}>
            {!posting ?
                (
                    <>
                        <CardContent>
                            <TextareaAutosize
                                className={classes.textArea}
                                rowsMin={4}
                                value={text}
                                placeholder={'Your post content...'}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button onClick={onPostButtonClicked}>Post</Button>
                        </CardActions>
                    </>
                ) : (
                    <CardContent className={classes.spinnerBox}>
                        <CircularProgress />
                    </CardContent>
                )
            }
        </Card>
    );
}
