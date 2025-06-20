import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
function Home(props) {
  return (
    <>
      <div className="home-container">
        <div className="instruction-container" style={{}}>
          <h3>Instruction</h3>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore
          molestiae perferendis praesentium expedita totam vero ab unde eius!
          Obcaecati id repudiandae commodi molestiae perspiciatis soluta
          distinctio cumque, animi iusto aperiam.
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
