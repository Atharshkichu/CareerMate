import { useState } from "react";

function InterviewPrep({ onBack }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const questions = {
    "Python Developer": [
      {
        question: "What is Python?",
        answer:
          "Python is a high-level, interpreted programming language known for its simple syntax and readability.",
      },
      {
        question: "What is a list in Python?",
        answer:
          "A list is an ordered and mutable collection that can store multiple values.",
      },
      {
        question: "What is Django?",
        answer:
          "Django is a Python web framework used to build secure and scalable web applications.",
      },
      {
        question: "What is OOP?",
        answer:
          "OOP stands for Object-Oriented Programming. It organizes programs using classes and objects.",
      },
    ],

    "Frontend Developer": [
      {
        question: "What is HTML?",
        answer:
          "HTML is used to structure the content of web pages.",
      },
      {
        question: "What is CSS?",
        answer:
          "CSS is used to style and design web pages.",
      },
      {
        question: "What is JavaScript?",
        answer:
          "JavaScript is a programming language used to add dynamic and interactive behavior to websites.",
      },
      {
        question: "What is React?",
        answer:
          "React is a JavaScript library used to build user interfaces.",
      },
    ],

    "Full Stack Developer": [
      {
        question: "What is frontend development?",
        answer:
          "Frontend development focuses on the user interface and client-side functionality of a web application.",
      },
      {
        question: "What is backend development?",
        answer:
          "Backend development handles server-side logic, databases, APIs, authentication, and application functionality.",
      },
      {
        question: "What is REST API?",
        answer:
          "A REST API allows applications to communicate with each other using HTTP methods such as GET, POST, PUT, and DELETE.",
      },
      {
        question: "What is a database?",
        answer:
          "A database is used to store, organize, and retrieve application data.",
      },
    ],
  };

  return (
    <div className="interview-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Home
      </button>

      <div className="interview-header">

        <h1>Interview Preparation 🎤</h1>

        <p>
          Practice common interview questions and
          improve your confidence.
        </p>

      </div>

      <div className="role-selector">

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setShowAnswers(false);
          }}
        >
          <option value="">
            Select your job role
          </option>

          {Object.keys(questions).map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}

        </select>

      </div>

      {selectedRole && (
        <div className="questions-container">

          <h2>
            {selectedRole} Interview Questions
          </h2>

          {questions[selectedRole].map(
            (item, index) => (
              <div
                className="question-card"
                key={index}
              >

                <h3>
                  {index + 1}. {item.question}
                </h3>

                {showAnswers && (
                  <p>
                    <strong>Answer:</strong>{" "}
                    {item.answer}
                  </p>
                )}

              </div>
            )
          )}

          <button
            className="answer-btn"
            onClick={() =>
              setShowAnswers(!showAnswers)
            }
          >
            {showAnswers
              ? "Hide Answers"
              : "Show Answers"}
          </button>

        </div>
      )}

    </div>
  );
}

export default InterviewPrep;