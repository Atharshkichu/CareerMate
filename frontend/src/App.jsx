import {
  useEffect,
  useState,
} from "react";

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

  const getInitialPage = () => {
    const savedPage =
      window.history.state?.page;

    if (savedPage) {
      return savedPage;
    }

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
  };

  const [page, setPage] =
    useState(getInitialPage);


  // =========================================
  // NAVIGATION
  // =========================================

  const navigate = (nextPage) => {
    window.history.pushState(
      {
        page: nextPage,
      },
      "",
      `#${nextPage}`
    );

    setPage(nextPage);
  };


  // =========================================
  // BROWSER BACK / FORWARD
  // =========================================

  useEffect(() => {
    const handlePopState = (event) => {
      const previousPage =
        event.state?.page;

      if (previousPage) {
        setPage(previousPage);
        return;
      }

      // If no history state exists
      // go to home
      setPage("home");
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    // Add initial browser history state
    if (!window.history.state?.page) {
      window.history.replaceState(
        {
          page,
        },
        "",
        `#${page}`
      );
    }

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [page]);


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
        onNavigate={navigate}

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

          navigate("home");
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
          navigate("home")
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
          navigate("home")
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
          navigate("dashboard")
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
          navigate("signup")
        }

        onLogin={() => {
          const isAdmin =
            localStorage.getItem(
              "jobmateIsAdmin"
            ) === "true";

          if (isAdmin) {
            navigate(
              "admin-dashboard"
            );
          } else {
            navigate(
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
          navigate("login")
        }

        onProfile={() =>
          navigate("profile")
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
          NAVIGATION BAR
      ====================================== */}

      <nav className="navbar">

        <div className="logo">
          CareerMate
        </div>


        <div className="nav-links">

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
          >
            Home
          </a>


          <a
            href="#jobs"
            onClick={(e) => {
              e.preventDefault();
              navigate("jobs");
            }}
          >
            Find Jobs
          </a>


          <a
            href="#roadmap"
            onClick={(e) => {
              e.preventDefault();
              navigate("roadmap");
            }}
          >
            Skill Roadmap
          </a>


          <a
            href="#interview"
            onClick={(e) => {
              e.preventDefault();
              navigate("interview");
            }}
          >
            Interview Prep
          </a>


          <a
            href="#applications"
            onClick={(e) => {
              e.preventDefault();
              navigate("applications");
            }}
          >
            My Applications
          </a>

        </div>


        <button
          className="login-btn"
          onClick={() =>
            navigate("login")
          }
        >
          Login
        </button>

      </nav>


      {/* =====================================
          HERO SECTION
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
            CareerMate helps you find jobs
            that match your skills, discover
            what you need to learn, and
            prepare for interviews.
          </p>


          <div className="buttons">

            <button
              className="primary-btn"
              onClick={() =>
                navigate("jobs")
              }
            >
              Find Jobs
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate("signup")
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
            navigate("jobs")
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
            navigate("roadmap")
          }
        >

          <h3>
            🎯 Skill Roadmap
          </h3>

          <p>
            Know exactly what skills you
            need for your dream job.
          </p>

        </div>


        {/* Interview Prep */}

        <div
          className="feature-card"
          onClick={() =>
            navigate("interview")
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