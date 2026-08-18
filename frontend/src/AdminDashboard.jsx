import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
  });

  const [editingJobId, setEditingJobId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [updatingApplicationId, setUpdatingApplicationId] =
    useState(null);

  // ---------------------------------------------
  // Load admin data
  // ---------------------------------------------

  const loadData = async () => {
    try {
      const statsResponse = await apiFetch(
        "/api/admin/dashboard/"
      );

      const statsData = await statsResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.detail ||
            statsData.error ||
            "Unable to load dashboard."
        );
      }

      setStats(statsData);

      const jobsResponse = await apiFetch(
        "/api/admin/jobs/"
      );

      const jobsData = await jobsResponse.json();

      if (!jobsResponse.ok) {
        throw new Error(
          jobsData.detail ||
            jobsData.error ||
            "Unable to load jobs."
        );
      }

      setJobs(jobsData);

      const applicationsResponse = await apiFetch(
        "/api/admin/applications/"
      );

      const applicationsData =
        await applicationsResponse.json();

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsData.detail ||
            applicationsData.error ||
            "Unable to load applications."
        );
      }

      setApplications(applicationsData);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------------------------------
  // Job form
  // ---------------------------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      location: "",
      salary: "",
      skills: "",
    });

    setEditingJobId(null);
  };

  // ---------------------------------------------
  // Add / Update Job
  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const url = editingJobId
        ? `/api/admin/jobs/${editingJobId}/`
        : "/api/admin/jobs/";

      const method = editingJobId
        ? "PUT"
        : "POST";

      const response = await apiFetch(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.detail ||
            "Could not save job."
        );
        return;
      }

      alert(
        editingJobId
          ? "Job updated successfully! ✅"
          : "Job created successfully! 🎉"
      );

      resetForm();

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to Django."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------
  // Edit Job
  // ---------------------------------------------

  const handleEdit = (job) => {
    setEditingJobId(job.id);

    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      skills: job.skills,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------------------------------------
  // Delete Job
  // ---------------------------------------------

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(
        `/api/admin/jobs/${jobId}/`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.detail ||
            "Could not delete job."
        );
        return;
      }

      alert(
        "Job deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to Django."
      );
    }
  };

  // ---------------------------------------------
  // Update Application Status
  // ---------------------------------------------

  const updateApplicationStatus = async (
    applicationId,
    status
  ) => {
    setUpdatingApplicationId(
      applicationId
    );

    try {
      const response = await apiFetch(
        `/api/admin/applications/${applicationId}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.detail ||
            "Could not update application status."
        );

        return;
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: data.status,
              }
            : application
        )
      );

      // Refresh statistics too
      const statsResponse = await apiFetch(
        "/api/admin/dashboard/"
      );

      const statsData =
        await statsResponse.json();

      if (statsResponse.ok) {
        setStats(statsData);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to Django."
      );
    } finally {
      setUpdatingApplicationId(
        null
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>
          Loading admin dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">

        <p className="tagline">
          JOBMATE ADMIN
        </p>

        <h1>
          Admin Dashboard 📊
        </h1>

        <p>
          Manage jobs and monitor applications.
        </p>

      </div>

      {/* Statistics */}
      {stats && (
        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>👥</span>
            <h2>
              {stats.total_users}
            </h2>
            <p>
              Total Users
            </p>
          </div>

          <div className="admin-stat-card">
            <span>💼</span>
            <h2>
              {stats.total_jobs}
            </h2>
            <p>
              Total Jobs
            </p>
          </div>

          <div className="admin-stat-card">
            <span>📋</span>
            <h2>
              {stats.total_applications}
            </h2>
            <p>
              Applications
            </p>
          </div>

          <div className="admin-stat-card">
            <span>🎤</span>
            <h2>
              {stats.interview}
            </h2>
            <p>
              Interviews
            </p>
          </div>

          <div className="admin-stat-card">
            <span>✅</span>
            <h2>
              {stats.selected}
            </h2>
            <p>
              Selected
            </p>
          </div>

          <div className="admin-stat-card">
            <span>❌</span>
            <h2>
              {stats.rejected}
            </h2>
            <p>
              Rejected
            </p>
          </div>

        </div>
      )}

      {/* Add / Edit Job */}
      <div className="admin-job-form">

        <h2>
          {editingJobId
            ? "Edit Job ✏️"
            : "Add New Job ➕"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (Python, Django, SQL)"
            value={form.skills}
            onChange={handleChange}
            required
          />

          <div className="admin-form-buttons">

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingJobId
                ? "Update Job"
                : "Add Job"}
            </button>

            {editingJobId && (
              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Manage Jobs */}
      <div className="admin-jobs-section">

        <h2>
          Manage Jobs 💼
        </h2>

        {jobs.length === 0 ? (
          <p>
            No jobs available.
          </p>
        ) : (
          <div className="admin-jobs-list">

            {jobs.map((job) => (
              <div
                className="admin-job-card"
                key={job.id}
              >

                <div>
                  <h3>
                    {job.title}
                  </h3>

                  <p>
                    {job.company}
                  </p>

                  <p>
                    📍 {job.location}
                  </p>

                  <p>
                    💰 {job.salary}
                  </p>

                  <p>
                    💻 {job.skills}
                  </p>
                </div>

                <div className="admin-job-actions">

                  <button
                    onClick={() =>
                      handleEdit(job)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(job.id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Manage Applications */}
      <div className="admin-applications-section">

        <h2>
          Manage Applications 📋
        </h2>

        {applications.length === 0 ? (
          <p>
            No applications available.
          </p>
        ) : (
          <div className="admin-applications-list">

            {applications.map(
              (application) => (
                <div
                  className="admin-application-card"
                  key={application.id}
                >

                  <div>
                    <h3>
                      {application.name}
                    </h3>

                    <p>
                      👤 {application.username}
                    </p>

                    <p>
                      💼 {application.job_title}
                    </p>

                    <p>
                      🏢 {application.company}
                    </p>

                    <p>
                      📍 {application.location}
                    </p>

                    <p>
                      📅{" "}
                      {new Date(
                        application.applied_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="admin-application-actions">

                    <span className="admin-status-label">
                      Status
                    </span>

                    <select
                      value={application.status}
                      disabled={
                        updatingApplicationId ===
                        application.id
                      }
                      onChange={(e) =>
                        updateApplicationStatus(
                          application.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Shortlisted">
                        Shortlisted
                      </option>

                      <option value="Interview">
                        Interview
                      </option>

                      <option value="Selected">
                        Selected
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;