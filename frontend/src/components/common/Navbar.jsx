// src/components/common/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/images/logo.png"; // adjust filename to match what you saved

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <Link
        to="/"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <img src={logo} alt="MeetUp" height="32" />
      </Link>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/join">Join Meeting</Link>
            <Link to="/profile">Profile</Link>
            <span style={{ color: "var(--text-secondary)" }}>
              Hi, {user.name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
