import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
function Home(props) {
  return (
    <>
      <div className="home-container">
        <div className="instruction-container" style={{}}>
          <h3>Instructions</h3>
          Welcome to Private Chat! To get started, please sign up for a new
          account or log in if you already have one. After logging in, you can
          securely chat privately with other users. Your conversations are
          confidential and easy to manage from your dashboard.
        </div>
        <div className="auth-container">
          <div className="auth-btn">
            <Link to={"/login"} className="auth-btn-link">
              login
            </Link>
          </div>
          <div className="auth-btn">
            <Link to={"/signup"} className="auth-btn-link">
              signup
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
