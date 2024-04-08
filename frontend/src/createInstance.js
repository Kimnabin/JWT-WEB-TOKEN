import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const refreshToken = async () => {
  try {
    const res = await axios.post("/v1/auth/refresh", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("error >> ", error);
  }
}

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(stateSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config; 
    },
    (error) => {
      return Promise.reject(error); // Returns a promise that is rejected
    }
  );
  return newInstance;
}