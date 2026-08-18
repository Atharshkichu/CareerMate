import { useState } from "react";
import { apiFetch } from "./api";

function JobDetails({ job, onBack }) {
  const [checked, setChecked] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const savedProfile =
    localStorage.getItem("jobmateProfile");

  const profile = savedProfile
    ? JSON.parse(savedProfile)
    : null;

  // ---------------------------------------------
  // User Skills
  // ---------------------------------------------

  const userSkills = profile?.skills
    ? profile.skills
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
    : [];

  // ---------------------------------------------
  // Required Job Skills
  // ---------------------------------------------

  const requiredSkills = job?.skills
    ? job.skills
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
    : [];

  // ---------------------------------------------
  // Missing Skills
  // ---------------------------------------------

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !userSkills.includes(skill)
  );

  const canApply =
    missingSkills.length === 0;

  // ---------------------------------------------
  // Apply Job
  // ---------------------------------------------

  const handleApply = async () => {
    const accessToken =
      localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("Please login first.");
      return;
    }

    if (!job?.id) {
      alert("Job information is missing.");
      return;
    }

    setApplying(true);

    try {
      const response = await apiFetch(
        "/api/applications/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            job_id: job.id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Application error:",
          data
        );

        if (response.status === 401) {
          alert(
            "Your login session has expired. Please login again."
          );
        } else {
          alert(
            data.detail ||
              data.error ||
              "Application could not be submitted."
          );
        }

        return;
      }

      setApplied(true);

      // Keep local data for current UI
      localStorage.setItem(
        "jobmateApplication",
        JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          status: "Applied",
        })
      );

      console.log(
        "Application saved:",
        data
      );

      alert(
        "Application submitted successfully! 🎉"
      );

    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      alert(
        "Could not connect to Django."
      );

    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-details-page">

      <div className="job-details-card">

        {/* Back Button */}
        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Jobs
        </button>

        {/* Job Details */}
        <h1>
          {job.title}
        </h1>

        <h3>
          {job.company}
        </h3>

        <p>
          📍 {job.location}
        </p>

        <p>
          💰 {job.salary}
        </p>

        <hr />

        {/* Required Skills */}
        <h2>
          Required Skills
        </h2>

        <p>
          {job.skills}
        </p>

        {/* Eligibility Check */}
        <button
          className="check-btn"
          onClick={() =>
            setChecked(true)
          }
        >
          Can I Apply?
        </button>

        {checked && (
          <div className="eligibility-box">

            {/* All Skills Match */}
            {canApply ? (
              <>
                <h2>
                  ✅ You can apply!
                </h2>

                <p>
                  Your current skills match
                  the required skills.
                </p>

                <button
                  className="apply-btn"
                  onClick={handleApply}
                  disabled={
                    applying || applied
                  }
                >
                  {applying
                    ? "Applying..."
                    : applied
                    ? "✅ Applied"
                    : "Apply Now"}
                </button>
              </>
            ) : (

              /* Missing Skills */
              <>
                <h2>
                  ⚠️ Skills Missing
                </h2>

                <p>
                  You can still apply,
                  but you should learn:
                </p>

                <ul>
                  {missingSkills.map(
                    (skill, index) => (
                      <li key={index}>
                        {skill}
                      </li>
                    )
                  )}
                </ul>

                <p>
                  💡 Learn these skills to
                  improve your chances.
                </p>

                <button
                  className="apply-btn"
                  onClick={handleApply}
                  disabled={
                    applying || applied
                  }
                >
                  {applying
                    ? "Applying..."
                    : applied
                    ? "✅ Applied"
                    : "Apply Anyway"}
                </button>
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default JobDetails;