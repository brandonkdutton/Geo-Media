import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CircularProgress from '@material-ui/core/CircularProgress';

// context imports
import { replyingToContext } from '../ReplyingToContextWrapper';
import { locationIdContext, addPostFncContext } from '../nonReducerContexts';

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

    const locationId = useContext(locationIdContext);
    const addPostFnc = useContext(addPostFncContext);
    const { replyingToState, replyingToDispatch } = useContext(replyingToContext);

    const replyingToThisPost = replyingToState === post_id;

    // clears the form, removes the spinner, closes reply box
    const onFinishedPosting = () => {
        setPosting(false);
        setText('');

        if(replyingToThisPost)
            replyingToDispatch({type: 'set', payload: null});
    };

    // validates form, sets the spinner, dispatches the api call
    const onPostButtonClicked = async () => {
        if(text === '')
            return alert('Your post must have content');

        setPosting(true);
        
        const parentId = post_id;
        await addPostFnc(locationId, parentId, text);
        onFinishedPosting();
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
                ):(
                    <CardContent className={classes.spinnerBox}>
                        <CircularProgress />
                    </CardContent>
                )
            }
        </Card>
    );
}
