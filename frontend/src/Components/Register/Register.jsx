import "./register.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRehister = (e) => {
        e.preventDefault() ;  // Prevents the page from refreshing
        const newUser = {
            email: email,
            username: username,
            password: password,
        };
        registerUser(newUser, dispatch, navigate);
    }

    return ( 
        <section className="register-container">
              <div className="register-title"> Sign up </div>
            <form onSubmit={handleRehister}>
                <label>EMAIL</label>
                <input 
                    type="text" 
                    placeholder="Enter your email" 
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <label>USERNAME</label>
                <input 
                    type="text" 
                    placeholder="Enter your username" 
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                <label>PASSWORD</label>
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button type="submit"> Create account </button>
            </form>
        </section>
        
     );
}
 
export default Register;