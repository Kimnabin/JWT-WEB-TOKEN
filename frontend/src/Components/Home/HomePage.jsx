import { useEffect } from "react";
import "./home.css";
import { getAllUsers, deleteUser } from "../../redux/apiRequest";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);

  let axiosJWT = axios.create()

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Function to handle the deletion of a user
  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  }

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

  axiosJWT.interceptors.request.use(
    async (config) => {
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config; 
    },
    (error) => {
      return Promise.reject(error); // Returns a promise that is rejected
    }
  );

  useEffect(() => {   // useEffect is a hook that allows you to run a function after the component has been rendered
    if (!user) {
      navigate("/login"); // Redirects the user to the login page
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT); // Dispatches the getAllUsers action
    }
  }, [])
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? "Admin" : "User"}`}
      </div>
      <div className="home-userlist">
        {/*
         ? - Optional chaining operator
         ? - If the value before the ? is null or undefined, the statement after the ? is not executed */}
        {userList?.map((user) => { // Maps through the userList array
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>

      <div className="errorMessage">{msg}</div>
    </main>
  );
};

export default HomePage;
