/*
    - Context higher order componant
    - Provedes children with a reducer to track and set which post is currently being replied to
    - Only one post can be being replied to at one time
    - Intended to wrap the PostStack componant
 */

import React, { createContext, useReducer } from 'react';

const replyingToContext = createContext(null);

// the HOC to provide the reducer context
const ReplyingToContextWrapper = (props) => {

    // id of the post being replied to. null indicates the root post because it is default
    const initialState = null;

    const reducer = (initialState, action) => {
        switch(action.type) {
            // set the id of the post being replied to
            case 'set':
                return action.payload;
            
            // do not change replying to id
            default:
                return initialState;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    // object to provide reducer as context
    const contextVal = {
        replyingToState: state,
        replyingToDispatch: dispatch,
    };

    return(
        <replyingToContext.Provider value={contextVal}>
            {props.children}
        </replyingToContext.Provider>
    );


};

// export all of the contexts
export { replyingToContext };

export default ReplyingToContextWrapper;