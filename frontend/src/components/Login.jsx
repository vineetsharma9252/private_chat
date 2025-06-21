import React from "react";
import "../styles/Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(props) {
  const navigate = useNavigate();
  const [user, setuser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://private-chat-3.onrender.com/login",
        user
      );

      // Store token only if login is successful
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      // If error response exists and it's a 401
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password. Try again.");
      } else {
        alert("Something went wrong: " + error.message);
        console.error(error);
      }
    }
  };
  return (
    <div className="signup-container">
      <div className="inner-container">
        <h1>Login</h1>
        <p>
          Enter your username and password to log in. After logging in, you can
          access your dashboard and start private chats with other users. If you
          don't have an account, please sign up first. Your credentials are kept
          secure.
        </p>
        <form className="input-container" method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          <button type="submit" align="left">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
