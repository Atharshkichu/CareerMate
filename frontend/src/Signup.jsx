import { useState } from "react";
import { apiFetch } from "./api";

function Signup({ onBackToLogin, onProfile }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ---------------------------------------------
  // Handle input changes
  // ---------------------------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------------------------
  // Submit signup form
  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (
      form.password !==
      form.confirmPassword
    ) {
      alert(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------
      // Send signup request to Django
      // -----------------------------------------

      const response = await apiFetch(
        "/api/signup/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data =
        await response.json();

      // -----------------------------------------
      // Handle backend errors
      // -----------------------------------------

      if (!response.ok) {
        console.error(
          "Signup error:",
          data
        );

        if (data.username) {
          alert(
            data.username[0]
          );
        } else if (data.email) {
          alert(
            data.email[0]
          );
        } else if (data.password) {
          alert(
            data.password[0]
          );
        } else if (data.detail) {
          alert(
            data.detail
          );
        } else if (data.error) {
          alert(
            data.error
          );
        } else {
          alert(
            "Could not create account."
          );
        }

        return;
      }

      // -----------------------------------------
      // Signup successful
      // -----------------------------------------

      console.log(
        "Signup successful:",
        data
      );

      alert(
        "Account created successfully! 🎉"
      );

      // Go to profile page
      onProfile();

    } catch (error) {
      console.error(
        "Signup connection error:",
        error
      );

      alert(
        "Could not connect to Django. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>
          Create Account 🚀
        </h1>

        <p>
          Join CareerMate and find
          your right career.
        </p>

        <form
          onSubmit={handleSubmit}
        >

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="signup-text">
          Already have an account?{" "}

          <span
            onClick={onBackToLogin}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Signup;