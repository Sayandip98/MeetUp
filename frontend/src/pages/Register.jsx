// src/pages/Register.jsx
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm.jsx";
import "../styles/auth.css";

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <RegisterForm />
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
