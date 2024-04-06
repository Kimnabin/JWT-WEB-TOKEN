import axios from 'axios';

import { 
        loginStart, 
        loginSuccess, 
        loginFailed, 
        registerStart, 
        registerSuccess, 
        registerFailed } from './authSlice';


export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart()); // Dispatches the loginStart action
    try {
        console.log("user >> ", user)
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