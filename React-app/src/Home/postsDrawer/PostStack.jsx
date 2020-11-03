/*
    - Recursiveley renders the posts in their indented structure
*/

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import HeaderCard from './BlankCard';
import PostCard from './PostCard';
import WriteCard from './WriteCard';

// context imports
import { expandedPostsContext } from '../ExpandedContextWrapper';
import { replyingToContext } from '../ReplyingToContextWrapper';


const useStyles = makeStyles((theme) => ({
    marginStyle: {
        paddingLeft: '8px',
        paddingRight: '16px',
        boxSizing: 'border-box',
    }
}));

const Dropper = (props) => {

    // destructure post data and reducers
    const { post_id, username, timestamp, content, replies } = props.postObj;
    const { expandedState } = React.useContext(expandedPostsContext);
    const { replyingToState, replyingToDispatch } = React.useContext(replyingToContext);

    // bools indicate if this current post's comment section and/or if it is currenlty being replied to
    const thisPostExpanded = expandedState.includes(post_id);
    const replyingToThisPost = replyingToState === post_id;

    return (<>

        {/* The post */}
        <Grid item style={{ 'width': `${props.width}%` }}>
            <PostCard 
                postObj={props.postObj}
            />
        </Grid>

        {/* Collapse contains the post's replies and WriteCard */}
        <Grid item style={{ 'width': `${props.width}%`, 'marginBottom': (thisPostExpanded ? '0px' : '-8px') }}>
            <Collapse in={thisPostExpanded} timeout="auto" unmountOnExit>
                <Grid container direction="column" justify="flex-start" alignItems="flex-end" spacing={1}>

                    {/* The post's WriteCard. Collapsed if not currently replying to post */}
                    <Grid item style={{ 'width': `${props.width * props.shrinkFactor}%`, 'marginBottom': (replyingToThisPost ? '0px' : '-8px') }}>
                        <Collapse in={replyingToThisPost} timeout="auto" unmountOnExit>
                                <WriteCard
                                    postObj={props.postObj}
                                />
                        </Collapse>
                    </Grid>

                    {/* Recursiveley render the post's replies */}
                    {props.postObj.replies.map((child) =>
                        props.generatePosts(child, props.width * props.shrinkFactor)
                    )}

                </Grid>
            </Collapse>
        </Grid>

    </>);
};


const PostStack = (props) => {
    const classes = useStyles();
    const shrinkFactor = 0.95;

    // context for replyingTo reducer
    const { replyingToState } = React.useContext(replyingToContext);

    // bool indicating if the root (default) post is the post being replied to
    const replyingToRootPost = replyingToState === null;

    const generatePosts = (postObj, width = 100) => {
        // bool indicates whether this instance of the base case post is being rendered
        const replyingToBaseCasePost = replyingToState === postObj.post_id;

        // the base case for the recursive generatePosts function
        if (postObj.replies.length === 0) {
            return (
                <>
                    {/* The post to render */}
                    <Grid item style={{ 'width': `${width}%` }}>
                        <PostCard 
                            postObj={postObj}
                        />
                    </Grid>

                    {/* The root post's collapsable WriteCard. Collapsed when not replying to the post */}
                    <Grid item style={{ 'width': `${width * shrinkFactor}%`, 'marginBottom': (replyingToBaseCasePost ? '0px' : '-8px') }}>
                        <Collapse in={replyingToBaseCasePost} timeout="auto" unmountOnExit>
                                <WriteCard
                                    postObj={postObj}
                                />
                        </Collapse>
                    </Grid>

                </>
            );
        }

        return (
            <Dropper
                width={width}
                postObj={postObj}
                shrinkFactor={shrinkFactor}
                generatePosts={generatePosts}
            />
        );
    };

    return (
        <Grid container direction="column" justify="flex-start" alignItems="flex-end" spacing={1} className={classes.marginStyle}>

            <Grid item style={{ 'width': '100%' }}>
                <HeaderCard 
                    headerData={props.headerData}
                    closeDrawer={props.closeDrawer}
                />
            </Grid>

            {props.postsToShow.map((rootPost) => (
                generatePosts(rootPost)
            ))}

            <Grid item style={{ 'width': `100%`, 'marginBottom': (replyingToRootPost ? '0px' : '-8px') }}>
                <Collapse in={replyingToRootPost} timeout="auto" unmountOnExit>
                        <WriteCard
                            postObj={{post_id: -1}}
                        />
                </Collapse>
            </Grid>
    
        </Grid>
    );

}

export default PostStack;