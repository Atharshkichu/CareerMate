import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function Dashboard({ onNavigate, onLogout }) {
  const [profile, setProfile] = useState(null);

  const [applicationCount, setApplicationCount] =
    useState(0);

  const [selectedCount, setSelectedCount] =
    useState(0);

  const [interviewCount, setInterviewCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        // -----------------------------------------
        // Get Profile
        // -----------------------------------------

        const profileResponse = await apiFetch(
          "/api/profile/me/"
        );

        const profileData =
          await profileResponse.json();

        if (profileResponse.ok) {
          setProfile(profileData);

          // Keep local copy for job matching
          localStorage.setItem(
            "jobmateProfile",
            JSON.stringify({
              name: profileData.name,
              education: profileData.education,
              branch: profileData.branch,
              skills: profileData.skills,
              location: profileData.location,
              experience: profileData.experience,
              desiredJob:
                profileData.desired_job,
              salary:
                profileData.expected_salary,
            })
          );
        } else {
          console.error(
            "Profile fetch error:",
            profileData
          );
        }

        // -----------------------------------------
        // Get Applications
        // -----------------------------------------

        const applicationsResponse =
          await apiFetch(
            "/api/applications/"
          );

        const applicationsData =
          await applicationsResponse.json();

        if (applicationsResponse.ok) {
          setApplicationCount(
            applicationsData.length
          );

          setSelectedCount(
            applicationsData.filter(
              (application) =>
                application.status ===
                "Selected"
            ).length
          );

          setInterviewCount(
            applicationsData.filter(
              (application) =>
                application.status ===
                "Interview"
            ).length
          );
        } else {
          console.error(
            "Applications fetch error:",
            applicationsData
          );
        }
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">

      {/* =========================================
          Navigation Bar
      ========================================= */}

      <nav className="navbar">

        <div className="logo">
          JobMate
        </div>

        <div className="nav-links">

          <a
            href="#"
            onClick={() =>
              onNavigate("dashboard")
            }
          >
            Dashboard
          </a>

          <a
            href="#"
            onClick={() =>
              onNavigate("jobs")
            }
          >
            Find Jobs
          </a>

          <a
            href="#"
            onClick={() =>
              onNavigate("roadmap")
            }
          >
            Skill Roadmap
          </a>

          <a
            href="#"
            onClick={() =>
              onNavigate("interview")
            }
          >
            Interview Prep
          </a>

          <a
            href="#"
            onClick={() =>
              onNavigate("applications")
            }
          >
            Applications
          </a>

        </div>

        <button
          className="login-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </nav>


      {/* =========================================
          Main Dashboard
      ========================================= */}

      <main className="dashboard-content">

        {/* Welcome Section */}
        <div className="welcome-section">

          <p className="tagline">
            YOUR JOB JOURNEY
          </p>

          <h1>
            Welcome back
            {profile?.name
              ? `, ${profile.name}`
              : ""} 👋
          </h1>

          <p>
            Let's move one step closer to
            your dream job.
          </p>

        </div>


        {/* =======================================
            Loading
        ======================================= */}

        {loading ? (

          <div className="profile-summary">

            <h2>
              Loading your profile...
            </h2>

          </div>

        ) : (

          <>

            {/* ===================================
                Application Summary
            =================================== */}

            <div className="application-summary">

              <div className="summary-card">

                <span>
                  📋
                </span>

                <h2>
                  {applicationCount}
                </h2>

                <p>
                  Applications
                </p>

              </div>


              <div className="summary-card">

                <span>
                  🎤
                </span>

                <h2>
                  {interviewCount}
                </h2>

                <p>
                  Interviews
                </p>

              </div>


              <div className="summary-card">

                <span>
                  ✅
                </span>

                <h2>
                  {selectedCount}
                </h2>

                <p>
                  Selected
                </p>

              </div>

            </div>


            {/* ===================================
                Dashboard Feature Cards
            =================================== */}

            <div className="dashboard-cards">


              {/* Find Jobs */}
              <div
                className="dashboard-card"
                onClick={() =>
                  onNavigate("jobs")
                }
              >

                <span className="card-icon">
                  🔎
                </span>

                <h2>
                  Find Jobs
                </h2>

                <p>
                  Discover jobs matching
                  your skills.
                </p>

                <button>
                  Explore Jobs →
                </button>

              </div>


              {/* Skill Roadmap */}
              <div
                className="dashboard-card"
                onClick={() =>
                  onNavigate("roadmap")
                }
              >

                <span className="card-icon">
                  🎯
                </span>

                <h2>
                  Skill Roadmap
                </h2>

                <p>
                  Learn the skills needed
                  for your dream job.
                </p>

                <button>
                  View Roadmap →
                </button>

              </div>


              {/* Interview Prep */}
              <div
                className="dashboard-card"
                onClick={() =>
                  onNavigate("interview")
                }
              >

                <span className="card-icon">
                  🎤
                </span>

                <h2>
                  Interview Prep
                </h2>

                <p>
                  Practice common interview
                  questions.
                </p>

                <button>
                  Start Practice →
                </button>

              </div>


              {/* Applications */}
              <div
                className="dashboard-card"
                onClick={() =>
                  onNavigate("applications")
                }
              >

                <span className="card-icon">
                  📋
                </span>

                <h2>
                  My Applications
                </h2>

                <p>
                  Track your job applications.
                </p>

                <button>
                  View Applications →
                </button>

              </div>

            </div>


            {/* ===================================
                Profile Summary
            =================================== */}

            <div className="profile-summary">

              <h2>
                Your Profile
              </h2>

              {profile ? (

                <>

                  <p>
                    👤 {profile.name}
                  </p>

                  <p>
                    🎓 {profile.education}
                  </p>

                  <p>
                    💻 {profile.branch}
                  </p>

                  <p>
                    🛠️ {profile.skills}
                  </p>

                  <p>
                    📍 {profile.location}
                  </p>

                  <p>
                    💼 {profile.experience}
                  </p>

                  <p>
                    🎯 {profile.desired_job}
                  </p>

                  {profile.expected_salary && (
                    <p>
                      💰 ₹
                      {profile.expected_salary}
                      /month
                    </p>
                  )}

                  <button
                    className="edit-profile-btn"
                    onClick={() =>
                      onNavigate("profile")
                    }
                  >
                    ✏️ Edit Profile
                  </button>

                </>

              ) : (

                <>

                  <p>
                    Your profile is not
                    created yet.
                  </p>

                  <button
                    className="edit-profile-btn"
                    onClick={() =>
                      onNavigate("profile")
                    }
                  >
                    Create Profile
                  </button>

                </>

              )}

            </div>

          </>

        )}

      </main>

    </div>
  );
}

export default Dashboard;