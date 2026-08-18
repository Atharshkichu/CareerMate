import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function Profile({ onComplete }) {
  const [profile, setProfile] = useState({
    name: "",
    education: "",
    branch: "",
    skills: "",
    location: "",
    experience: "",
    desiredJob: "",
    salary: "",
  });

  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // Load existing profile
  // ---------------------------------------------

  useEffect(() => {
    const loadProfile = async () => {
      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(
          "/api/profile/me/"
        );

        const data = await response.json();

        if (response.ok) {
          setProfile({
            name: data.name || "",
            education: data.education || "",
            branch: data.branch || "",
            skills: data.skills || "",
            location: data.location || "",
            experience: data.experience || "",
            desiredJob: data.desired_job || "",
            salary: data.expected_salary || "",
          });
        }
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ---------------------------------------------
  // Handle input changes
  // ---------------------------------------------

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------------------------
  // Save profile
  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken =
      localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await apiFetch(
        "/api/profiles/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: profile.name,
            education: profile.education,
            branch: profile.branch,
            skills: profile.skills,
            location: profile.location,
            experience: profile.experience,
            desired_job: profile.desiredJob,
            expected_salary: profile.salary
              ? Number(profile.salary)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            data.error ||
            "Profile could not be saved."
        );

        return;
      }

      // Keep local copy for job matching
      localStorage.setItem(
        "jobmateProfile",
        JSON.stringify({
          name: profile.name,
          education: profile.education,
          branch: profile.branch,
          skills: profile.skills,
          location: profile.location,
          experience: profile.experience,
          desiredJob: profile.desiredJob,
          salary: profile.salary,
        })
      );

      alert(
        "Profile updated successfully! 🎉"
      );

      onComplete();

    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to Django."
      );
    }
  };

  // ---------------------------------------------
  // Loading
  // ---------------------------------------------

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-box">
          <h2>
            Loading your profile...
          </h2>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // Form
  // ---------------------------------------------

  return (
    <div className="profile-page">

      <form
        className="profile-box"
        onSubmit={handleSubmit}
      >

        <h1>
          Edit Your Profile 👤
        </h1>

        <p>
          Update your details to improve
          your job recommendations.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          required
        />

        <select
          name="education"
          value={profile.education}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Education
          </option>

          <option value="10th">
            10th
          </option>

          <option value="12th">
            12th
          </option>

          <option value="Diploma">
            Diploma
          </option>

          <option value="Degree">
            Degree
          </option>

          <option value="Post Graduate">
            Post Graduate
          </option>
        </select>

        <input
          type="text"
          name="branch"
          placeholder="Degree / Branch"
          value={profile.branch}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (Example: Python, HTML, JavaScript)"
          value={profile.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Preferred Location"
          value={profile.location}
          onChange={handleChange}
          required
        />

        <select
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Experience
          </option>

          <option value="Fresher">
            Fresher
          </option>

          <option value="0-1 Year">
            0 - 1 Year
          </option>

          <option value="1-3 Years">
            1 - 3 Years
          </option>

          <option value="3+ Years">
            3+ Years
          </option>
        </select>

        <input
          type="text"
          name="desiredJob"
          placeholder="Desired Job Role"
          value={profile.desiredJob}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Expected Salary (₹ per month)"
          value={profile.salary}
          onChange={handleChange}
        />

        <button type="submit">
          Save Changes
        </button>

      </form>

    </div>
  );
}

export default Profile;