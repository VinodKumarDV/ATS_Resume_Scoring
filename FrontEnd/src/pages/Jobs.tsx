import { useEffect, useState } from "react";

import { api } from "../services/api";
import "./Jobs.css";

type Job = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadJobs = async () => {
    try {
      const url = filter
        ? `/jobs?status=${filter}`
        : "/jobs";

      const response = await api.get(url);

      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const createJob = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/jobs", {
        title,
        description,
      });

      setTitle("");
      setDescription("");

      loadJobs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeJob = async (
    jobId: number
  ) => {
    try {
      await api.put(
        `/jobs/${jobId}/close`
      );

      loadJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteJob = async (
    jobId: number
  ) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await api.delete(
          `/jobs/${jobId}`
        );

        loadJobs();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openEditModal = (job: Job) => {
    setSelectedJob(job);
    setEditTitle(job.title);
    setEditDescription(job.description);
    setShowEditModal(true);
  };

  const updateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedJob) return;

    try {
      await api.put(`/jobs/${selectedJob.id}`, {
        title: editTitle,
        description: editDescription,
      });

      setShowEditModal(false);
      setSelectedJob(null);
      loadJobs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <div className="jobs-title">
          <h1 className="page-title">Jobs</h1>
          <p className="page-subtitle">
            Manage your job postings
          </p>
        </div>
      </div>

      {/* Create Job Form */}
      <div className="form-section">
        <h2 className="section-title">
          Create New Job
        </h2>
        <form onSubmit={createJob}>
          <div className="form-content">
            <div className="form-group">
              <label className="form-label">
                Job Title
              </label>
              <input
                className="form-input"
                placeholder="e.g., Senior React Developer"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Job Description
              </label>
              <textarea
                className="form-textarea"
                placeholder="Enter job description, requirements, and responsibilities..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Section */}
      <div className="jobs-toolbar">
        <label htmlFor="status-filter" className="form-label">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="">
            All Jobs
          </option>

          <option value="open">
            Open
          </option>

          <option value="closed">
            Closed
          </option>
        </select>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            📋
          </div>
          <h3 className="empty-state-title">
            No jobs found
          </h3>
          <p className="empty-state-text">
            Create a new job posting to get started
          </p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
            >
              <div className="job-header">
                <h3 className="job-title">
                  {job.title}
                </h3>
                <p className="job-description">
                  {job.description}
                </p>
              </div>

              <div className="job-meta">
                <span
                  className={`job-status ${job.status}`}
                >
                  {job.status}
                </span>
              </div>

              <div className="job-actions">
                <button
                  onClick={() =>
                    openEditModal(job)
                  }
                  className="button button-primary"
                >
                  Edit
                </button>

                {job.status === "open" && (
                  <button
                    onClick={() =>
                      closeJob(job.id)
                    }
                    className="button button-success"
                  >
                    Close
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteJob(job.id)
                  }
                  className="button button-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Job</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={updateJob}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
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
