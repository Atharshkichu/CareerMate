import { useState } from "react";

function SkillRoadmap({ onBack }) {
  const [selectedJob, setSelectedJob] = useState("");

  const roadmaps = {
    "Python Developer": [
      "Python Basics",
      "Object-Oriented Programming",
      "SQL & Databases",
      "Django",
      "REST APIs",
      "Git & GitHub",
      "Build Real Projects",
    ],

    "Frontend Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "Responsive Design",
      "React",
      "Git & GitHub",
      "Build Real Projects",
    ],

    "Full Stack Developer": [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Python",
      "Django",
      "SQL",
      "REST APIs",
      "Git & GitHub",
      "Build Real Projects",
    ],

    "Embedded Engineer": [
      "C Programming",
      "Digital Electronics",
      "Microcontrollers",
      "Embedded C",
      "UART / SPI / I2C",
      "PCB Basics",
      "Embedded Projects",
    ],
  };

  return (
    <div className="roadmap-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="roadmap-header">
        <h1>Skill Roadmap 🎯</h1>

        <p>
          Choose your dream job and discover the skills
          you need to build your career.
        </p>
      </div>

      <div className="roadmap-selector">

        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">
            Select your desired job
          </option>

          {Object.keys(roadmaps).map((job) => (
            <option key={job} value={job}>
              {job}
            </option>
          ))}
        </select>

      </div>

      {selectedJob && (
        <div className="roadmap-container">

          <h2>
            {selectedJob} Roadmap 🚀
          </h2>

          <p>
            Follow these skills in order to become
            job-ready.
          </p>

          <div className="roadmap-list">

            {roadmaps[selectedJob].map(
              (skill, index) => (
                <div
                  className="roadmap-item"
                  key={skill}
                >

                  <div className="roadmap-number">
                    {index + 1}
                  </div>

                  <div>
                    <h3>{skill}</h3>

                    <p>
                      Step {index + 1} of{" "}
                      {roadmaps[selectedJob].length}
                    </p>
                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default SkillRoadmap;