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
                body: JSON.stringify({ code: userCode, exerciseId: "exercise6" }),
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
                    exerciseId: "exercise6",
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
          <h2 className="instructions-title">1.6 Arithmetic</h2>

          <div className="instructions-description">
            <p>One thing computers are capable of doing exceptionally well is performing arithmetic. Addition, subtraction, multiplication, division, and other numeric calculations are easy to do in most programming languages, and Python is no exception. Some examples:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise16.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>Above are a number of arithmetic operations, each assigned to a variable. The variable will hold the final result of each operation. Combinations of arithmetical operators follow the usual order of operations.</p>
            <p>Python also offers a companion to division called the modulo operator. The modulo operator is indicated by <span className="highlight"> %</span> and returns the remainder after division is performed.</p>
            <div className="instructions-image-container">
               <img src="/images/exercise16(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>In the above code block, we use the modulo operator to find the remainder of <span className="highlight">15</span> divided by <span className="highlight">2</span>. Since <span className="highlight">15</span> is an odd number the remainder is <span className="highlight">1</span>.</p>
            <p>We also check the remainder of <span className="highlight">133/7</span>. Since <span className="highlight">133</span> divided by <span className="highlight">7</span> has no remainder, <span className="highlight">133%7</span> evaluates to <span className="highlight">0</span>.</p>
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. Multiply two numbers together and assign the result to a variable called <span className="highlight">product</span>.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Remember creating a variable is as simple as setting it equal to something else!</p>
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
      <div className="footer-description">
    <p>6/11</p>
  </div>
        <Link to="/exercise5">
                  <button className="back-button">← Back</button>
                </Link>
         {isCorrect && (
                                         <Link to="/exercise7">
                                           <button className="next-button">Next Exercise →</button>
                                         </Link>
                                       )}
      </div>
          
    </div>
  );
};

export default Exercise;
