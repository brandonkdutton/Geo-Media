import React, { useState, useEffect } from 'react';
import { postData } from '../api/requests';

//fetch and dispatch post actions from a specific post
const usePostsFromPostId = (postId, addLocationFnc) => {
    const[posts, setPosts] = useState([]);

    useEffect(() => {
        if(postId)
            refreshPosts(postId);
        
    },[postId]);

    const refreshPosts = async (loc_id) => {
        const uri = `${process.env.REACT_APP_API_BASE_URI}/location/post?loc_id=${loc_id}`;
        fetch(uri).then(function(response) {
            response.json().then(res => setPosts(
                res['posts'] ? res['posts'] : []
            ));
        });
    };

    const addPostToLocation = async (locIdParam, parentId, content) => {
        //tell the api to add a post with the given data
        //then updates the post state to reflect the new post structure
        let locId = locIdParam;

        if(locIdParam === -1) {
            let response = await addLocationFnc();
            locId = response['loc_id'];
        }

        const uri = `/location/post?loc_id=${locId}`;
        await postData(uri, {
            'user_id': 1,
            'parent_id': parentId,
            'content': content,
        });

        refreshPosts(locId);
    };
    
    const actions = { addPostToLocation };
    const hook = { postsById: posts, ...actions };

    return hook;
};

export { usePostsFromPostId };
