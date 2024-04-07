import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name : 'user',
    initialState : {
        users: {
            allUsers : null,
            isFetching : false,
            error : false,
        },
        msg: "",
    },
    reducers : {
        getUsersStart : (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess : (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailed : (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart : (state) => {
            state.users.isFetching = true;
        },
        deleteUserSuccess : (state, action) => {
            state.users.isFetching = false;
            // state.users.allUsers = state.users.allUsers.filter(user => user._id !== action.payload);
            state.msg = action.payload; 
        },
        deleteUserFailed : (state, action) => {
            state.users.isFetching = false;
            state.users.error = true;
            state.msg = action.payload;
        }
    }
});

export const { 
    getUsersStart, 
    getUsersSuccess, 
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed } = userSlice.actions;

export default userSlice.reducer;