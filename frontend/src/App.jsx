import { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Jobs from "./Jobs";
import Applications from "./Applications";
import SkillRoadmap from "./SkillRoadmap";
import InterviewPrep from "./InterviewPrep";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

import "./App.css";

function App() {
  // =========================================
  // INITIAL PAGE
  // =========================================

  const [page, setPage] = useState(() => {
    const loggedIn =
      localStorage.getItem("jobmateUser");

    const isAdmin =
      localStorage.getItem("jobmateIsAdmin") ===
      "true";

    if (!loggedIn) {
      return "home";
    }

    if (isAdmin) {
      return "admin-dashboard";
    }

    return "dashboard";
  });


  // =========================================
  // ADMIN DASHBOARD
  // =========================================

  if (page === "admin-dashboard") {
    return (
      <AdminDashboard />
    );
  }


  // =========================================
  // USER DASHBOARD
  // =========================================

  if (page === "dashboard") {
    return (
      <Dashboard
        onNavigate={(nextPage) =>
          setPage(nextPage)
        }

        onLogout={() => {
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

          setPage("home");
        }}
      />
    );
  }


  // =========================================
  // INTERVIEW PREP
  // =========================================

  if (page === "interview") {
    return (
      <InterviewPrep
        onBack={() =>
          setPage("home")
        }
      />
    );
  }


  // =========================================
  // SKILL ROADMAP
  // =========================================

  if (page === "roadmap") {
    return (
      <SkillRoadmap
        onBack={() =>
          setPage("home")
        }
      />
    );
  }


  // =========================================
  // APPLICATIONS
  // =========================================

  if (page === "applications") {
    return (
      <Applications />
    );
  }


  // =========================================
  // JOBS
  // =========================================

  if (page === "jobs") {
    return (
      <Jobs />
    );
  }


  // =========================================
  // PROFILE
  // =========================================

  if (page === "profile") {
    return (
      <Profile
        onComplete={() =>
          setPage("dashboard")
        }
      />
    );
  }


  // =========================================
  // LOGIN
  // =========================================

  if (page === "login") {
    return (
      <Login
        onSignup={() =>
          setPage("signup")
        }

        onLogin={() => {
          const isAdmin =
            localStorage.getItem(
              "jobmateIsAdmin"
            ) === "true";

          if (isAdmin) {
            setPage(
              "admin-dashboard"
            );
          } else {
            setPage(
              "dashboard"
            );
          }
        }}
      />
    );
  }


  // =========================================
  // SIGNUP
  // =========================================

  if (page === "signup") {
    return (
      <Signup
        onBackToLogin={() =>
          setPage("login")
        }

        onProfile={() =>
          setPage("profile")
        }
      />
    );
  }


  // =========================================
  // HOME PAGE
  // =========================================

  return (
    <div className="app">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav className="navbar">

        <div className="logo">
          CareerMate
        </div>


        <div className="nav-links">

          <a
            href="#"
            onClick={() =>
              setPage("home")
            }
          >
            Home
          </a>


          <a
            href="#"
            onClick={() =>
              setPage("jobs")
            }
          >
            Find Jobs
          </a>


          <a
            href="#"
            onClick={() =>
              setPage("roadmap")
            }
          >
            Skill Roadmap
          </a>


          <a
            href="#"
            onClick={() =>
              setPage("interview")
            }
          >
            Interview Prep
          </a>


          <a
            href="#"
            onClick={() =>
              setPage("applications")
            }
          >
            My Applications
          </a>

        </div>


        <button
          className="login-btn"
          onClick={() =>
            setPage("login")
          }
        >
          Login
        </button>

      </nav>


      {/* =====================================
          HERO
      ====================================== */}

      <main className="hero">

        <div className="hero-content">

          <p className="tagline">
            YOUR CAREER PARTNER
          </p>


          <h1>
            Find the right job.
            <br />
            Build your future.
          </h1>


          <p className="description">
            CareerMate helps you find jobs that
            match your skills, discover what you
            need to learn, and prepare for interviews.
          </p>


          <div className="buttons">

            <button
              className="primary-btn"
              onClick={() =>
                setPage("jobs")
              }
            >
              Find Jobs
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                setPage("signup")
              }
            >
              Create Profile
            </button>

          </div>

        </div>

      </main>


      {/* =====================================
          FEATURES
      ====================================== */}

      <section className="features">


        {/* Find Jobs */}
        <div
          className="feature-card"
          onClick={() =>
            setPage("jobs")
          }
        >

          <h3>
            🔎 Find Jobs
          </h3>

          <p>
            Discover jobs that match your
            education and skills.
          </p>

        </div>


        {/* Skill Roadmap */}
        <div
          className="feature-card"
          onClick={() =>
            setPage("roadmap")
          }
        >

          <h3>
            🎯 Skill Roadmap
          </h3>

          <p>
            Know exactly what skills you need
            for your dream job.
          </p>

        </div>


        {/* Interview Prep */}
        <div
          className="feature-card"
          onClick={() =>
            setPage("interview")
          }
        >

          <h3>
            🎤 Interview Prep
          </h3>

          <p>
            Practice HR and technical
            interview questions.
          </p>

        </div>

      </section>

    </div>
  );
}

export default App;