import { useEffect, useState } from "react";
import { apiFetch } from "./api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {
        setError(
          "Please login to view your applications."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(
          "/api/applications/"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.error ||
              "Failed to load applications."
          );
        }

        setApplications(data);
      } catch (error) {
        console.error(error);

        setError(
          "Could not load applications. Please make sure Django is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      case "Interview":
        return "status-interview";

      case "Shortlisted":
        return "status-shortlisted";

      default:
        return "status-applied";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Applied":
        return "Application submitted successfully.";

      case "Shortlisted":
        return "Your application has been shortlisted.";

      case "Interview":
        return "You have been selected for an interview.";

      case "Selected":
        return "Congratulations! You have been selected.";

      case "Rejected":
        return "This application was not selected.";

      default:
        return "Application status updated.";
    }
  };

  if (loading) {
    return (
      <div className="applications-page">
        <h2>Loading applications...</h2>
      </div>
    );
  }

  return (
    <div className="applications-page">

      <div className="applications-header">
        <h1>
          My Applications 📋
        </h1>

        <p>
          Track your complete job application journey.
        </p>
      </div>

      {error ? (
        <div className="empty-applications">
          <h2>{error}</h2>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-applications">
          <h2>No applications yet</h2>

          <p>
            Apply to a job and it will appear here.
          </p>
        </div>
      ) : (
        <div className="applications-list">

          {applications.map((application) => (
            <div
              className="application-card"
              key={application.id}
            >

              <div className="application-info">

                <h2>
                  {application.job_title}
                </h2>

                <h3>
                  {application.company}
                </h3>

                <p>
                  📍 {application.location}
                </p>

                <p>
                  💰 {application.salary}
                </p>

                <p>
                  📅 Applied on{" "}
                  {new Date(
                    application.applied_at
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="application-progress">

                <div
                  className={`application-status ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </div>

                <p className="status-message">
                  {getStatusMessage(
                    application.status
                  )}
                </p>

                <div className="status-timeline">

                  <div
                    className={
                      application.status !== "Rejected"
                        ? "timeline-step active"
                        : "timeline-step"
                    }
                  >
                    <span>1</span>
                    <p>Applied</p>
                  </div>

                  <div
                    className={
                      [
                        "Shortlisted",
                        "Interview",
                        "Selected",
                      ].includes(application.status)
                        ? "timeline-step active"
                        : "timeline-step"
                    }
                  >
                    <span>2</span>
                    <p>Shortlisted</p>
                  </div>

                  <div
                    className={
                      [
                        "Interview",
                        "Selected",
                      ].includes(application.status)
                        ? "timeline-step active"
                        : "timeline-step"
                    }
                  >
                    <span>3</span>
                    <p>Interview</p>
                  </div>

                  <div
                    className={
                      application.status === "Selected"
                        ? "timeline-step active"
                        : application.status === "Rejected"
                        ? "timeline-step rejected"
                        : "timeline-step"
                    }
                  >
                    <span>4</span>

                    <p>
                      {application.status === "Rejected"
                        ? "Rejected"
                        : "Result"}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Applications;