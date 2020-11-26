/*
    - Componant contains all posts which are replies to a root post
    - Compartmentalized in own componant for conveniance
*/

import React, { useContext } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import PostCard from './PostCard';
import WriteCard from './WriteCard';

import { expandedPostsContext } from '../reducerContextWrappers/ExpandedContextWrapper';
import { replyingToContext } from '../reducerContextWrappers/ReplyingToContextWrapper';

const Dropper = (props) => {

    const { post_id } = props.postObj;
    const { expandedState } = useContext(expandedPostsContext);
    const { replyingToState } = useContext(replyingToContext);

    const thisPostExpanded = expandedState.includes(post_id);
    const replyingToThisPost = (replyingToState === post_id);

    return (<>

        {/* The actual post */}
        <Grid item style={{ 'width': `${props.width}%` }}>
            <PostCard 
                postObj={props.postObj}
            />
        </Grid>

        {/* Collapsable container containing all the post's replies and its WriteCard */}
        {/* The style props are to maintaine even spacing between the cards regardless of their expanded state */}

        <Grid item style={{ 'width': `${props.width}%`, 'marginBottom': (thisPostExpanded ? '0px' : '-8px') }}>
            <Collapse in={thisPostExpanded} timeout="auto" unmountOnExit>
                <Grid container direction="column" justify="flex-start" alignItems="flex-end" spacing={1}>

                    {/* The post's WriteCard. Collapsed when not currently replying to this post */}
                    <Grid item style={{ 'width': `${props.width * props.shrinkFactor}%`, 'marginBottom': (replyingToThisPost ? '0px' : '-8px') }}>
                        <Collapse in={replyingToThisPost} timeout="auto" unmountOnExit>
                                <WriteCard
                                    postObj={props.postObj}
                                />
                        </Collapse>
                    </Grid>

                    {/* Recurse and render self's replies slightley narrower than self */}
                    {props.postObj.replies.map((child) =>
                        props.generatePosts(child, props.width * props.shrinkFactor)
                    )}

                </Grid>
            </Collapse>
        </Grid>

    </>);
};

export default Dropper;