import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import JobDetails from "./JobDetails";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedProfile =
    localStorage.getItem("jobmateProfile");

  const profile = savedProfile
    ? JSON.parse(savedProfile)
    : null;

  // ---------------------------------------------
  // Fetch jobs from Django API
  // ---------------------------------------------

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiFetch(
          "/api/jobs/"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.error ||
              "Failed to fetch jobs."
          );
        }

        setJobs(data);
      } catch (error) {
        console.error(
          "Jobs fetch error:",
          error
        );

        setError(
          "Unable to load jobs. Make sure Django server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ---------------------------------------------
  // Open Job Details
  // ---------------------------------------------

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  // ---------------------------------------------
  // Calculate Job Match
  // ---------------------------------------------

  const calculateMatch = (job) => {
    if (!profile) {
      return 0;
    }

    const userSkills = profile.skills
      ? profile.skills
          .toLowerCase()
          .split(",")
          .map((skill) => skill.trim())
      : [];

    const jobSkills = job.skills
      ? job.skills
          .toLowerCase()
          .split(",")
          .map((skill) => skill.trim())
      : [];

    const matchedSkills = jobSkills.filter(
      (skill) =>
        userSkills.includes(skill)
    );

    const skillScore =
      jobSkills.length > 0
        ? (matchedSkills.length /
            jobSkills.length) *
          70
        : 0;

    const locationScore =
      profile.location &&
      job.location &&
      job.location
        .toLowerCase()
        .includes(
          profile.location.toLowerCase()
        )
        ? 20
        : 0;

    const experienceScore =
      profile.experience === "Fresher" &&
      job.title
        .toLowerCase()
        .includes("fresher")
        ? 10
        : 0;

    return Math.round(
      Math.min(
        skillScore +
          locationScore +
          experienceScore,
        100
      )
    );
  };

  // ---------------------------------------------
  // Search + Location Filter
  // ---------------------------------------------

  const filteredJobs = jobs
    .filter((job) => {
      const searchText =
        search.toLowerCase().trim();

      const locationText =
        locationFilter
          .toLowerCase()
          .trim();

      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(searchText) ||
        job.company
          .toLowerCase()
          .includes(searchText) ||
        job.skills
          .toLowerCase()
          .includes(searchText);

      const matchesLocation =
        locationText === "" ||
        job.location
          .toLowerCase()
          .includes(locationText);

      return (
        matchesSearch &&
        matchesLocation
      );
    })
    .sort(
      (a, b) =>
        calculateMatch(b) -
        calculateMatch(a)
    );

  // ---------------------------------------------
  // Loading
  // ---------------------------------------------

  if (loading) {
    return (
      <div className="jobs-page">
        <h2>
          Loading jobs...
        </h2>
      </div>
    );
  }

  // ---------------------------------------------
  // Error
  // ---------------------------------------------

  if (error) {
    return (
      <div className="jobs-page">
        <h2>
          {error}
        </h2>

        <p>
          Please check your Django server.
        </p>
      </div>
    );
  }

  // ---------------------------------------------
  // Jobs Page
  // ---------------------------------------------

  return (
    <div className="jobs-page">

      {/* Header */}
      <div className="jobs-header">

        <h1>
          Jobs For You 🎯
        </h1>

        <p>
          Find jobs that match your
          skills and preferences.
        </p>

      </div>

      {/* Search and Filters */}
      <div className="job-filters">

        <input
          type="text"
          placeholder="🔎 Search job, company or skill..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="📍 Location"
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(e.target.value)
          }
        />

        <button
          onClick={() => {
            setSearch("");
            setLocationFilter("");
          }}
        >
          Clear
        </button>

      </div>

      {/* No Jobs */}
      {filteredJobs.length === 0 ? (
        <div className="empty-applications">

          <h2>
            No jobs found 😕
          </h2>

          <p>
            Try a different job title,
            skill or location.
          </p>

        </div>
      ) : (

        /* Jobs List */
        <div className="jobs-container">

          {filteredJobs.map((job) => {

            const matchScore =
              calculateMatch(job);

            return (
              <div
                className="job-card"
                key={job.id}
              >

                {/* Job Header */}
                <div className="job-top">

                  <div>

                    <h2>
                      {job.title}
                    </h2>

                    <h3>
                      {job.company}
                    </h3>

                  </div>

                  <div className="match-score">
                    {matchScore}% Match
                  </div>

                </div>

                {/* Job Info */}
                <p>
                  📍 {job.location}
                </p>

                <p>
                  💰 {job.salary}
                </p>

                <p>
                  💻 {job.skills}
                </p>

                {/* View Job */}
                <button
                  onClick={() =>
                    setSelectedJob(job)
                  }
                >
                  View Job
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Jobs;