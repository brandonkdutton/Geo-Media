/*
    - Context higher order componant
    - Provedes children with a reducer to get and add new posts
 */

import React, { createContext, useReducer, useEffect } from 'react';

const postsContext = createContext(null);

const middleWare = (dispatch) => {
    return (action) => {
        switch (action.type) {
            // fetch all the posts for a location from the api. Injects the fetched posts into the payload
            case 'getAllFromLocId':
                (() => {
                    const uri = `${process.env.REACT_APP_API_BASE_URI}/location/post?loc_id=${action.payload.locId}`;
                    fetch(uri).then((response) => {
                        response.json().then((res) => {
                            const newAction = Object.assign({}, action);
                            newAction.payload = res['posts'];
                            dispatch(newAction);
                        });
                    });
                })();
                break;
            // Adds a post to a location based on the location's id and the parent post's id
            // payload args: parentId, content, locationState, locationDispatch
            // no payload modification is necessary as the api returns only the new post's id
            case 'addPostToLoc':
                (() => {
                    const uri = `${process.env.REACT_APP_API_BASE_URI}/location/post?loc_id=${action.payload.locId}`;
                    const data = {
                        'user_id': 1,
                        'parent_id': action.payload.parentId,
                        'content': action.payload.content,
                    };
                    fetch(uri, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    }).then(res => {
                        dispatch(action);
                    });
                })();
                break;
            default:
                return dispatch(action);
        }
    };
};

// the HOC to provide the reducer context
const PostsContextWrapper = (props) => {

    // id of the post being replied to.
    const initialState = {
        posts: [],
        onDispatchSuccess: () => null,
    };

    const reducer = (initialState, action) => {
        switch (action.type) {
            // updates the list of all locations fetched form the api
            case 'getAllFromLocId':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.posts = action.payload;
                    return newState;
                })();
            // updates the new state with the promise to resolve once the new post has been successfully added
            case 'addPostToLoc':
                return (() => {
                    const newState = Object.assign({}, initialState);
                    newState.onDispatchSuccess = action.payload.onResolve;
                    return newState;
                })();

            // do not change replying to id
            default:
                return initialState;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    // object to provide reducer as context
    const contextVal = {
        postsState: state,
        postsDispatch: middleWare(dispatch),
    };

    // fullfill any promisses pending on dispatch completion
    useEffect(() => {
        state.onDispatchSuccess(state);
    },[state]);

    return (
        <postsContext.Provider value={contextVal}>
            {props.children}
        </postsContext.Provider>
    );


};

// export all of the contexts
export { postsContext };

export default PostsContextWrapper;