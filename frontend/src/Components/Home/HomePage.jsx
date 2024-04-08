import { useEffect } from "react";
import "./home.css";
import { getAllUsers, deleteUser } from "../../redux/apiRequest";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess )
  // Function to handle the deletion of a user
  const handleDelete = (id) => {
    deleteUser(user?.accessToken, dispatch, id, axiosJWT);
  };


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
