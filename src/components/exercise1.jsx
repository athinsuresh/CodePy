import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/exercise.css";

import CodeEditor from "./CodeEditor";
import { Link } from "react-router-dom";

const Exercise = () => {
  const [showHint, setShowHint] = useState(false);
   // For navigating to the next exercise
   const [userCode, setUserCode] = useState(""); // Store user input
   const [isCorrect, setIsCorrect] = useState(false);
   const [feedback, setFeedback] = useState("");
   const [completed, setCompleted] = useState(false);

   const handleSubmit = async () => {
    const userData = localStorage.getItem("user"); 
    console.log("🔍 Raw user data from localStorage:", userData);
    const response = await fetch("http://localhost:3001/validate-solution", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ code: userCode, exerciseId: "exercise1" }),
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
            exerciseId: "exercise1",
        };

        console.log("🚀 Sending progress update request:", requestBody); // Debugging

        await fetch("http://localhost:3001/update-progress", {
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
          <h2 className="instructions-title">1.1 Hello World</h2>

          <div className="instructions-description">
            <p>If programming is the act of teaching a computer to have a conversation with a user, it would be most useful to first teach the computer how to speak. In Python, this is accomplished with the print statement.</p>
            <p>A print statement is the easiest way to get your Python program to communicate with you. Being able to command this communication will be one of the most valuable tools in your programming toolbox.</p>
            <div className="instructions-image-container">
               <img src="/images/exercise10.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. Using a print statement, output a message <span className="highlight">Hello World!</span> to the terminal.</p>
          </div>

          {/* Hint Section */}
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Hint: Print a message by typing print followed by your message in quotes</p>
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
        <CodeEditor/>
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
      <div className="footer-description">
    <p>1/11</p>
  </div>
        {isCorrect && (
          <Link to="/exercise2">
            <button className="next-button">Next Exercise →</button>
          </Link>
        )}
      </div>
          
    </div>
  );
};

export default Exercise;
