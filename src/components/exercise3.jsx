import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/exercise.css";
import CodeEditor from "./CodeEditor";
import { Link } from "react-router-dom";

const Exercise = () => {
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate(); // For navigating to the next exercise

  const [userCode, setUserCode] = useState(""); // Store user input
     const [isCorrect, setIsCorrect] = useState(false);
     const [feedback, setFeedback] = useState("");
  
     const handleSubmit = async () => {
    const userData = localStorage.getItem("user"); 
    console.log("🔍 Raw user data from localStorage:", userData);
    const response = await fetch("http://localhost:5000/validate-solution", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ code: userCode, exerciseId: "exercise2" }),
    });

    const data = await response.json();
    setIsCorrect(data.success);
    setFeedback(data.message);

    if (data.success) {
        // Update progress
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) return; 

        const requestBody = {
            email: user.email,
            course: "course1",
            exerciseId: "exercise3",
        };

        console.log("🚀 Sending progress update request:", requestBody); // Debugging

        await fetch("http://localhost:5000/update-progress", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody),
        });
    }
};

  return (
    <div className="exercise-page">
      <Navbar />

      {/* Main Content */}
      <div className="exercise-container">
        {/* Left Side: Instructions */}
        <div className="instructions-container">
          <h2 className="instructions-title">1.3 Strings</h2>

          <div className="instructions-description">
            <p>When printing things in Python, we are supplying a text block that we want to be printed. Text in Python is considered a specific type of data called a <span className="highlight">string</span>. A string, so named because they’re a series of letters, numbers, or symbols connected in order — as if threaded together by string.</p>
            <p>Strings can be defined in different ways</p>
            <p>We can combine multiple strings using <span className="highlight">+</span>, like so:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise13.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>This code will print out <span className="highlight"> "This is a good string" </span></p>
           <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">
            1. Try adding your name to the print statement with the <span className="highlight">+</span> operator so that this Python program prints <span className="highlight">“Hello [your_name]”</span>.
  </p>
          </div>

          {/* Hint Section */}
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              
                <div className="hint-content">
<div className="instructions-image-container">
               <img src="/images/exercise13_hint.png" alt="Hello World Example" className="instructions-image" />
           </div>
                    </div>
              
            )}
          </div>
          <div className="input-container">
            <p className="instructions-todo">Submit Answer Here</p>
          <h2 className="solutions-title">Test your code in the console and submit your solutions here</h2>
            <textarea
              className="user-input-box"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Type your code here"
              rows="5"
            />
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
            {feedback && (
  <p className={`feedback ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}>
    {feedback}
  </p>
)}
          </div>
        </div>

        {/* Right Side: Code Editor */}
        
          <CodeEditor />
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
            <Link to="/exercise2">
          <button className="back-button">← Back</button>
        </Link>
        <div className="footer-description">
    <p>3/11</p>
  </div>
              {isCorrect && (
                        <Link to="/exercise4">
                          <button className="next-button">Next Exercise →</button>
                        </Link>
                      )}
            </div>
    </div>
  );
};

export default Exercise;
