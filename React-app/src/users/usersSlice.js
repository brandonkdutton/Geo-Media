import { createSlice } from '@reduxjs/toolkit';

const initialState = [
    { id: '0', name: 'さくら' },
    { id: '1', name: '茂'},
    { id: '2', name: '武'},
];

const usersSlice = createSlice( {
    name: 'users',
    initialState,
    reducers: {}
});

export default usersSlice.reducer;