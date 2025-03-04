import React, { useState } from "react";
import Navbar from "./Navbar";
import "../styles/exercise.css";
import CodeEditor from "./CodeEditor";
import { Link } from "react-router-dom";
import CodeSnippet from "./CodeSnippet";

const Exercise = () => {
  const [showHint, setShowHint] = useState(false);
   // For navigating to the next exercise
  const [userCode, setUserCode] = useState(""); // Store user input
           const [isCorrect, setIsCorrect] = useState(false);
           const [feedback, setFeedback] = useState("");
           const starterCode = `city_name = "St.Potatosburg"
           # Define the city's population
           city_pop = 340000`;
           const handleSubmit = async () => {
            const userData = localStorage.getItem("user"); 
            console.log("🔍 Raw user data from localStorage:", userData);
            const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify({ code: userCode, exerciseId: "exercise7" }),
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
                    exerciseId: "exercise7",
                };
        
                console.log("🚀 Sending progress update request:", requestBody); // Debugging
        
                await fetch("https://codepy-qio0.onrender.com/update-progress", {
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
          <h2 className="instructions-title">1.7 Comments</h2>

          <div className="instructions-description">
            <p>Most of the time, code should be written in such a way that it is easy to understand on its own. However, if you want to include a piece of information to explain a part of your code, you can use the <span className="highlight">#</span> sign. A line of text preceded by a <span className="highlight">#</span> is called a <span className="highlight">comment</span>. The machine does not run this code — it is only for humans to read. When you look back at your code later, A comment is a piece of text in a program used to explain code. Comments may help you figure out what it was intended to do.</p>
           <div className="instructions-image-container">
               <img src="/images/exercise17.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
             <CodeSnippet code={starterCode} />
            <p className="instructions-todo-description-question-question">1. Add a comment for <span className="highlight">city_pop</span> with a description of what you think the variable contains.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Come on! This should be easy for you! You're a coding wizard in the making!🧙‍♂️✨</p>
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
        <Link to="/exercise6">
                  <button className="back-button">← Back</button>
                </Link>
                <div className="footer-description">
    <p>7/11</p>
  </div>
        {isCorrect && (
                       <Link to="/exercise8">
                          <button className="next-button">Next Exercise →</button>
                        </Link>
          )}
      </div>
          
    </div>
  );
};

export default Exercise;
