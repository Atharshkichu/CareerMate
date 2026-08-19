import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_jobs: 0,
    total_applications: 0,
    selected: 0,
    rejected: 0,
    interview: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] =
    useState(false);

  const [message, setMessage] = useState("");

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
  });

  // ==================================================
  // FETCH ADMIN DASHBOARD DATA
  // ==================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsResponse = await apiFetch(
        "/api/admin/dashboard/"
      );

      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        setStats(statsData);
      } else {
        console.error(
          "Stats error:",
          statsData
        );
      }

      // Fetch all jobs
      const jobsResponse = await apiFetch(
        "/api/admin/jobs/"
      );

      const jobsData = await jobsResponse.json();

      if (jobsResponse.ok) {
        setJobs(jobsData);
      } else {
        console.error(
          "Jobs error:",
          jobsData
        );
      }

      // Fetch all applications
      const applicationsResponse =
        await apiFetch(
          "/api/admin/applications/"
        );

      const applicationsData =
        await applicationsResponse.json();

      if (applicationsResponse.ok) {
        setApplications(
          applicationsData
        );
      } else {
        console.error(
          "Applications error:",
          applicationsData
        );
      }
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==================================================
  // JOB FORM CHANGE
  // ==================================================

  const handleJobChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // ADD JOB
  // ==================================================

  const handleAddJob = async (e) => {
    e.preventDefault();

    setJobLoading(true);
    setMessage("");

    try {
      const response = await apiFetch(
        "/api/admin/jobs/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: jobForm.title,
            company: jobForm.company,
            location: jobForm.location,
            salary: jobForm.salary,
            skills: jobForm.skills,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Add job error:",
          data
        );

        alert(
          data.error ||
            "Could not add job."
        );

        return;
      }

      setMessage(
        "Job added successfully! 🎉"
      );

      setJobForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        skills: "",
      });

      await fetchDashboardData();
    } catch (error) {
      console.error(
        "Add job error:",
        error
      );

      alert(
        "Could not connect to Django."
      );
    } finally {
      setJobLoading(false);
    }
  };

  // ==================================================
  // DELETE JOB
  // ==================================================

  const handleDeleteJob = async (
    jobId
  ) => {
    const confirmed =
      window.confirm(
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
        console.error(
          "Delete job error:",
          data
        );

        alert(
          data.error ||
            "Could not delete job."
        );

        return;
      }

      setMessage(
        "Job deleted successfully."
      );

      await fetchDashboardData();
    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      alert(
        "Could not connect to Django."
      );
    }
  };

  // ==================================================
  // UPDATE APPLICATION STATUS
  // ==================================================

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    setApplicationLoading(true);

    try {
      const response = await apiFetch(
        `/api/admin/applications/${applicationId}/status/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Status update error:",
          data
        );

        alert(
          data.error ||
            "Could not update status."
        );

        return;
      }

      setMessage(
        "Application status updated successfully."
      );

      await fetchDashboardData();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Could not connect to Django."
      );
    } finally {
      setApplicationLoading(false);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "jobmateUser"
    );

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "jobmateProfile"
    );

    localStorage.removeItem(
      "jobmateApplication"
    );

    localStorage.removeItem(
      "jobmateIsAdmin"
    );

    window.location.href = "/";
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>
          Loading admin dashboard...
        </h2>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="dashboard-page">

      {/* =========================================
          NAVBAR
      ========================================== */}

      <nav className="navbar">

        <div className="logo">
          CareerMate Admin
        </div>

        <div className="nav-links">
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Dashboard
          </a>

          <a
            href="#jobs"
            onClick={(e) => {
              e.preventDefault();

              document
                .getElementById("admin-jobs")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Jobs
          </a>

          <a
            href="#applications"
            onClick={(e) => {
              e.preventDefault();

              document
                .getElementById(
                  "admin-applications"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Applications
          </a>
        </div>

        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

      {/* =========================================
          MAIN CONTENT
      ========================================== */}

      <main className="dashboard-content">

        {/* Header */}

        <div className="welcome-section">

          <p className="tagline">
            CAREERMATE ADMIN
          </p>

          <h1>
            Admin Dashboard 📊
          </h1>

          <p>
            Manage jobs and monitor
            applications.
          </p>

        </div>

        {/* Success Message */}

        {message && (
          <div
            className="eligibility-box"
            style={{
              marginBottom: "20px",
            }}
          >
            ✅ {message}
          </div>
        )}

        {/* =====================================
            STAT CARDS
        ====================================== */}

        <div className="dashboard-cards">

          {/* Users */}

          <div className="dashboard-card">
            <span className="card-icon">
              👥
            </span>

            <h2>
              {stats.total_users}
            </h2>

            <p>
              Total Users
            </p>
          </div>

          {/* Jobs */}

          <div className="dashboard-card">
            <span className="card-icon">
              💼
            </span>

            <h2>
              {stats.total_jobs}
            </h2>

            <p>
              Total Jobs
            </p>
          </div>

          {/* Applications */}

          <div className="dashboard-card">
            <span className="card-icon">
              📋
            </span>

            <h2>
              {stats.total_applications}
            </h2>

            <p>
              Applications
            </p>
          </div>

          {/* Interviews */}

          <div className="dashboard-card">
            <span className="card-icon">
              🎤
            </span>

            <h2>
              {stats.interview}
            </h2>

            <p>
              Interviews
            </p>
          </div>

          {/* Selected */}

          <div className="dashboard-card">
            <span className="card-icon">
              ✅
            </span>

            <h2>
              {stats.selected}
            </h2>

            <p>
              Selected
            </p>
          </div>

          {/* Rejected */}

          <div className="dashboard-card">
            <span className="card-icon">
              ❌
            </span>

            <h2>
              {stats.rejected}
            </h2>

            <p>
              Rejected
            </p>
          </div>

        </div>

        {/* =====================================
            ADD NEW JOB
        ====================================== */}

        <section
          className="profile-summary"
          id="admin-jobs"
        >

          <h2>
            Add New Job ➕
          </h2>

          <form
            onSubmit={handleAddJob}
          >

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={jobForm.title}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={jobForm.company}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={jobForm.location}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={jobForm.salary}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="skills"
              placeholder="Skills (Python, Django, SQL)"
              value={jobForm.skills}
              onChange={handleJobChange}
              required
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={jobLoading}
            >
              {jobLoading
                ? "Adding Job..."
                : "Add Job"}
            </button>

          </form>

        </section>

        {/* =====================================
            JOB LIST
        ====================================== */}

        <section className="profile-summary">

          <h2>
            Manage Jobs 💼
          </h2>

          {jobs.length === 0 ? (
            <p>
              No jobs available.
            </p>
          ) : (
            <div className="jobs-container">

              {jobs.map((job) => (
                <div
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-top">

                    <div>

                      <h2>
                        {job.title}
                      </h2>

                      <h3>
                        {job.company}
                      </h3>

                    </div>

                  </div>

                  <p>
                    📍 {job.location}
                  </p>

                  <p>
                    💰 {job.salary}
                  </p>

                  <p>
                    💻 {job.skills}
                  </p>

                  <button
                    className="login-btn"
                    onClick={() =>
                      handleDeleteJob(
                        job.id
                      )
                    }
                  >
                    🗑️ Delete Job
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* =====================================
            APPLICATIONS
        ====================================== */}

        <section
          className="profile-summary"
          id="admin-applications"
        >

          <h2>
            All Applications 📋
          </h2>

          {applications.length === 0 ? (
            <p>
              No applications yet.
            </p>
          ) : (
            <div className="jobs-container">

              {applications.map(
                (application) => (
                  <div
                    className="job-card"
                    key={application.id}
                  >

                    <h2>
                      {application.job_title}
                    </h2>

                    <h3>
                      {application.company}
                    </h3>

                    <p>
                      👤{" "}
                      {application.name}
                    </p>

                    <p>
                      🧑‍💻{" "}
                      {application.username}
                    </p>

                    <p>
                      📍{" "}
                      {application.location}
                    </p>

                    <p>
                      📅{" "}
                      {application.applied_at
                        ? new Date(
                            application.applied_at
                          ).toLocaleString()
                        : "N/A"}
                    </p>

                    <div
                      style={{
                        marginTop:
                          "15px",
                      }}
                    >

                      <label>
                        Status:
                      </label>

                      <select
                        value={
                          application.status
                        }
                        disabled={
                          applicationLoading
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            application.id,
                            e.target.value
                          )
                        }
                        style={{
                          marginLeft:
                            "10px",
                        }}
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

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;