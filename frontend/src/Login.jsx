import { useState } from "react";

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
      const response = await fetch(
        "http://127.0.0.1:8000/api/token/",
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
        console.error("Login error:", data);

        alert(
          "Invalid username or password."
        );

        return;
      }

      // Save JWT tokens
      localStorage.setItem(
        "accessToken",
        data.access
      );

      localStorage.setItem(
        "refreshToken",
        data.refresh
      );

      // Save user information
      localStorage.setItem(
        "jobmateUser",
        JSON.stringify({
          username: form.username,
        })
      );

      alert("Login successful! 🎉");

      onLogin();

    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to Django. Make sure the backend server is running."
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
          Login to continue with JobMate
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