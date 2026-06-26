import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">ATS</h2>
        <p className="subtitle">Resume Scorer</p>
      </div>

      <nav className="nav-menu">
        <ul>
          <li>
            <a
              href="/jobs"
              className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/jobs");
              }}
            >
              <span className="icon">📋</span>
              <span className="label">Jobs</span>
            </a>
          </li>
          <li>
            <a
              href="/candidates"
              className={`nav-link ${isActive("/candidates") ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/candidates");
              }}
            >
              <span className="icon">👥</span>
              <span className="label">Candidates</span>
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile");
              }}
            >
              <span className="icon">👤</span>
              <span className="label">Profile</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
