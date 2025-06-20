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
      const response = await axios.post("http://localhost:5000/login", user);

      console.log("reponse is " + response.status);
      if (response.status === 401) {
        alert("unable to find the user . Try again");
      } else if (response.status === 200) {
        alert("login successfull");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Something went wrong ");
      console.log("something went wrong ...");
    }
  };
  return (
    <div className="signup-container">
      <div className="inner-container">
        <h1>Login</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex libero
          quaerat doloribus aspernatur voluptates nesciunt repellat esse? Saepe
          reprehenderit amet animi magni. Accusamus saepe numquam facilis
          assumenda nihil, veritatis sapiente?
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
