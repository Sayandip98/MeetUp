// src/pages/Login.jsx
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm.jsx";
import "../styles/auth.css";

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <LoginForm />
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
