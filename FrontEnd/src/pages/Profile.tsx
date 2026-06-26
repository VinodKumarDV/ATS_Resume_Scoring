import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./Profile.css";

type Recruiter = {
  id: number;
  name: string;
  email: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log("Profile response:", res.data);
        
        // Handle both direct recruiter object and wrapped response
        const recruiterData = res.data.token || res.data;
        setRecruiter(recruiterData);
      } catch (err: any) {
        console.error("Profile error:", err);
        setError(err.response?.data?.detail || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <p className="loading">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          View your account information
        </p>
      </div>

      {recruiter && (
        <div className="profile-card">
          <div className="profile-section">
            <h2 className="section-title">Account Information</h2>
            
            <div className="profile-info">
              <div className="info-group">
                <label className="info-label">Full Name</label>
                <p className="info-value">{recruiter.name}</p>
              </div>

              <div className="info-group">
                <label className="info-label">Email Address</label>
                <p className="info-value">{recruiter.email}</p>
              </div>

              <div className="info-group">
                <label className="info-label">Recruiter ID</label>
                <p className="info-value">#{recruiter.id}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={() => navigate("/jobs")}
              className="button button-secondary"
            >
              ← Back to Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
