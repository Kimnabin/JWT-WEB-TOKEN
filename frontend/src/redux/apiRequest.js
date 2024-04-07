import axios from 'axios';
import  { 
        loginStart, 
        loginSuccess, 
        loginFailed, 
        registerStart, 
        registerSuccess, 
        registerFailed } from './authSlice';
import { 
        getUsersStart, 
        getUsersSuccess, 
        getUsersFailed, 
        deleteUserStart, 
        deleteUserSuccess, 
        deleteUserFailed } from './userSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart()); // Dispatches the loginStart action
    try {
        const res = await axios.post("/v1/auth/login", user);   // Makes a POST request to the server
        dispatch(loginSuccess(res.data));   // Dispatches the loginSuccess action
        navigate("/");  // Redirects the user to the home page
    } catch (error) {
        console.log("err >> ", error);
        dispatch(loginFailed());    // Dispatches the loginFailed action
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());   // Dispatches the registerStart action
    try {
        await axios.post("/v1/auth/register", user);    // Makes a POST request to the server
        dispatch(registerSuccess()); // Dispatches the registerSuccess action
        navigate("/login"); // Redirects the user to the login page
    } catch (error) {
        dispatch(registerFailed());  // Dispatches the registerFailed action
    }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart()); // Dispatches the loginStart action
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers : {
                token : `Bearer ${accessToken}`  // Passes the access token in the header
            }
        });
        dispatch(getUsersSuccess(res.data));   // Dispatches the loginSuccess action
    } catch (error) {
        dispatch(getUsersFailed());    // Dispatches the loginFailed action
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart()); // Dispatches the loginStart action
    try {
        const res = await axiosJWT.delete(`/v1/user/` + id, {
            headers : {
                token : `Bearer ${accessToken}`  // Passes the access token in the header
            }
        });
        dispatch(deleteUserSuccess(res.data));   // Dispatches the loginSuccess action
    } catch (error) {
        dispatch(deleteUserFailed(error.response.data));    // Dispatches the loginFailed action
    }
}