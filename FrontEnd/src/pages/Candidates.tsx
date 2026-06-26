import { useEffect, useState } from "react";
import { api } from "../services/api";
import "./Candidates.css";

type Candidate = {
  id: number;
  name: string;
  email: string;
  score: number;
  matching_skills: string;
  missing_skills: string;
  summary: string;
};

type Job = {
  id: number;
  title: string;
};

export default function Candidates() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Load Jobs
  const loadJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load Candidates for Job
  const loadCandidates = async (jobId: number) => {
    try {
      const res = await api.get(`/candidates/job/${jobId}`);
      setCandidates(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleJobChange = (jobId: number) => {
    setSelectedJob(jobId);
    loadCandidates(jobId);
  };

  const uploadCandidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob || !file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("job_id", selectedJob.toString());
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", file);

    try {
      await api.post("/candidates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      setEmail("");
      setFile(null);

      loadCandidates(selectedJob);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (candidateId: number) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.delete(`/candidates/${candidateId}`);
        if (selectedJob) {
          loadCandidates(selectedJob);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openEditModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEditName(candidate.name);
    setEditEmail(candidate.email);
    setShowEditModal(true);
  };

  const updateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCandidate) return;

    try {
      await api.put(`/candidates/${selectedCandidate.id}`, {
        name: editName,
        email: editEmail,
      });

      setShowEditModal(false);
      setSelectedCandidate(null);
      
      if (selectedJob) {
        loadCandidates(selectedJob);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="candidates-container">
      <div className="candidates-header">
        <h1 className="page-title">Candidates</h1>
        <p className="page-subtitle">
          Manage and score candidates for your jobs
        </p>
      </div>

      {/* Job Selector */}
      <div className="job-selector-section">
        <div className="selector-group">
          <div className="form-group">
            <label htmlFor="job-select" className="form-label">
              Select Job
            </label>
            <select
              id="job-select"
              className="form-select"
              value={selectedJob || ""}
              onChange={(e) =>
                handleJobChange(Number(e.target.value))
              }
            >
              <option value="">-- Choose a job --</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedJob ? (
        <>
          {/* Upload Candidate Form */}
          <div className="upload-form-section">
            <h2 className="section-title">
              Upload Candidate Resume
            </h2>
            <form onSubmit={uploadCandidate}>
              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">
                    Candidate Name
                  </label>
                  <input
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Candidate Email
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Resume File (PDF/DOC)
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files?.[0] || null)
                      }
                      accept=".pdf,.doc,.docx"
                      required
                    />
                    <label htmlFor="file-input" className="file-input-label">
                      {file ? file.name : "📁 Click to select or drag and drop"}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={loading || !file}
                  >
                    {loading ? "Uploading..." : "Upload Resume"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Candidates List */}
          {candidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                👥
              </div>
              <h3 className="empty-state-title">
                No candidates yet
              </h3>
              <p className="empty-state-text">
                Upload candidate resumes to get started
              </p>
            </div>
          ) : (
            <div className="candidates-grid">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="candidate-card"
                >
                  <div className="candidate-header">
                    <h3 className="candidate-name">
                      {c.name}
                    </h3>
                    <p className="candidate-email">
                      {c.email}
                    </p>
                  </div>

                  <div className="candidate-score">
                    <div className="score-label">
                      Match Score
                    </div>
                    <div className="score-value">
                      {c.score}%
                    </div>
                  </div>

                  <div className="candidate-skills">
                    <div className="skills-group">
                      <div className="skills-label">
                        ✅ Matching Skills
                      </div>
                      <div className="skills-list matching">
                        {c.matching_skills || "None"}
                      </div>
                    </div>

                    <div className="skills-group">
                      <div className="skills-label">
                        ❌ Missing Skills
                      </div>
                      <div className="skills-list missing">
                        {c.missing_skills || "None"}
                      </div>
                    </div>
                  </div>

                  <div className="candidate-summary">
                    <div className="summary-label">
                      📝 Summary
                    </div>
                    <p className="summary-text">
                      {c.summary || "No summary available"}
                    </p>
                  </div>

                  <div className="candidate-actions">
                    <button
                      onClick={() => openEditModal(c)}
                      className="button button-primary"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteCandidate(c.id)}
                      className="button button-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="no-job-selected">
          <div className="empty-state-icon">
            📋
          </div>
          <h3 className="empty-state-title">
            Select a job to continue
          </h3>
          <p className="empty-state-text">
            Choose a job posting from the dropdown above to upload and view candidates
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCandidate && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Candidate</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={updateCandidate}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="button button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}