import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/dashboard" className="navbar-logo">
          TaskFlow
        </Link>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Dashboard
          </Link>

          <Link
            to="/tasks"
            className={
              location.pathname === "/tasks"
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Tasks
          </Link>

          <Link
  to="/profile"
  className={
    location.pathname === "/profile"
      ? "navbar-link active"
      : "navbar-link"
  }
>
  Profile
</Link>
        </div>

        <div className="navbar-user">
          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.name || "User"}
            </span>

            <span className="navbar-user-email">
              {user?.email || ""}
            </span>
          </div>

          <button
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;