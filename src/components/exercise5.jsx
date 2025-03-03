import React, { useState } from "react";
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
     
        const handleSubmit = async () => {
          const userData = localStorage.getItem("user"); 
          console.log("🔍 Raw user data from localStorage:", userData);
          const response = await fetch("http://localhost:5000/validate-solution", {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}` 
              },
              body: JSON.stringify({ code: userCode, exerciseId: "exercise5" }),
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
                  exerciseId: "exercise5",
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
          <h2 className="instructions-title">1.5 Variables</h2>

          <div className="instructions-description">
            <p>In Python, and when programming in general, we need to build systems for dealing with data that changes over time. That data could be the location of a plane, or the time of day, or the television show you’re currently watching. The only important thing is that it may be different at different times. Python uses <span className="highlight">variables</span> to define things that are subject to change.</p>
           <div className="instructions-image-container">
               <img src="/images/exercise15.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>In the above example, we defined a variable called <span className="highlight">greeting_message</span> and set it equal to the string <span className="highlight">"Welcome to CodePy"</span>. It also defined a variable called <span className="highlight">current_exercise</span> and set it equal to the number 5.</p>
            
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. Create a variable called <span className="highlight">todays_date</span> and assign a value that will represent <span className="highlight">todays_date</span> to that variable.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <div className="instructions-image-container">
               <img src="/images/exercise15(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
              </div>
            )}
          </div>
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

          {/* Hint Section */}
          
        </div>

        {/* Right Side: Code Editor */}
        
          <CodeEditor />
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
        <Link to="/exercise4">
                  <button className="back-button">← Back</button>
                </Link>
                <div className="footer-description">
    <p>5/11</p>
  </div>
        {isCorrect && (
                                <Link to="/exercise6">
                                  <button className="next-button">Next Exercise →</button>
                                </Link>
                              )}
      </div>
          
    </div>
  );
};

export default Exercise;
