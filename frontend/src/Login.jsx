import { useState } from "react";
import { apiFetch } from "./api";

function Login({ onSignup, onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // ------------------------------------------
      // Get JWT tokens
      // ------------------------------------------

      const response = await apiFetch(
        "/api/token/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            "Invalid username or password."
        );

        return;
      }

      // ------------------------------------------
      // Save tokens
      // ------------------------------------------

      localStorage.setItem(
        "accessToken",
        data.access
      );

      localStorage.setItem(
        "refreshToken",
        data.refresh
      );

      localStorage.setItem(
        "jobmateUser",
        JSON.stringify({
          username: form.username,
        })
      );

      // ------------------------------------------
      // Check admin access
      // ------------------------------------------

      const adminResponse = await apiFetch(
        "/api/admin/dashboard/"
      );

      if (adminResponse.ok) {
        localStorage.setItem(
          "jobmateIsAdmin",
          "true"
        );
      } else {
        localStorage.removeItem(
          "jobmateIsAdmin"
        );
      }

      alert(
        "Login successful! 🎉"
      );

      onLogin();

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Could not connect to Django."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Login to continue with CareerMate
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}

          <span onClick={onSignup}>
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;