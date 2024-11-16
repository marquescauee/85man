import React, { useState } from "react";
import LoginModal from "../../components/LoginModal/LoginModal";
import "./Login.css";

const Login = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="login-container">
      <h1>GMV Academia</h1>
      <button className="btn btn-light" onClick={() => setShowModal(true)}>
        Login
      </button>

      <LoginModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Login;
