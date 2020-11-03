/* 
    - Exports all contexts that don't require a reducer
*/

import React from 'react';

const locationIdContext = React.createContext(null);
const addPostFncContext = React.createContext(null);
const nearLocationIdsContext = React.createContext(null);

export { locationIdContext, addPostFncContext, nearLocationIdsContext };