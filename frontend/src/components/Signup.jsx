import React from "react";
import "../styles/Signup.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate();
  const [user, setuser] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://private-chat-3.onrender.com//signup",
        user
      );

      console.log("Response:", response);

      if (response.status === 201) {
        alert("User submitted successfully");
        localStorage.setItem("user_id", response.data.user);
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.status === 409) {
        alert("Email already exists!");
      } else {
        alert("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="inner-container">
        <h1>Signup</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex libero
          quaerat doloribus aspernatur voluptates nesciunt repellat esse? Saepe
          reprehenderit amet animi magni. Accusamus saepe numquam facilis
          assumenda nihil, veritatis sapiente?
        </p>
        <form className="input-container" method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="username"
          />

          <input
            type="text"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="password"
          />
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="email"
          />

          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            placeholder="phone number"
          />
          <button type="submit" align="left">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
