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
                            body: JSON.stringify({ code: userCode, exerciseId: "exercise1final" }),
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
                                exerciseId: "exercise11",
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
          <h2 className="instructions-title">1.11 Final Review and Quiz Time!</h2>

          <div className="instructions-description">
          <h3>Great! So far we’ve looked at:</h3>
           <ul>
            <li>Print statements</li>
            <li>How to create, modify, and use variables</li>
            <li>Arithmetic operations like addition, subtraction, division, and multiplication</li>
            <li>How to use comments to make your code easy to understand</li>
            <li>Different data types, including strings, ints, floats, and booleans</li>
            <li>Converting between data types</li>
           </ul>
           </div>
           <div className="instructions-container-highlight">
  <p className="instructions-todo">Instructions</p>
  
  <p className="instructions-todo-description-question">1.  
    Let’s apply all of the concepts you have learned one more time!
    Create a variable called <span className="highlight">product</span> and set it equal to the string <span className="highlight">"Python Syntax"</span>.
  </p>

  <p className="instructions-todo-description-question">2.  
    Create a variable called <span className="highlight">exercises_completed</span> and set it equal to 13. Create another variable called <span className="highlight">points_per_exercise</span> and set it equal to 5.
  </p>

  <p className="instructions-todo-description-question">3.  
    Create a variable called <span className="highlight">point_total</span> and set it equal to 100.
  </p>

  <p className="instructions-todo-description-question">4.  
    Update <span className="highlight">point_total</span> to be the original value plus the result of multiplying <span className="highlight">exercises_completed</span> and <span className="highlight">points_per_exercise</span>.
  </p>

  <p className="instructions-todo-description-question">5.  
    Add a comment above your declaration of <span className="highlight">points_per_exercise</span> that says:
  </p>

  <div className="instructions-image-container">
    <img src="/images/exercise20(11).png" alt="Hello World Example" className="instructions-image" />
  </div>

  <p className="instructions-todo-description-question">6.  
    Print a string to the console that says:
  </p>

  <div className="instructions-image-container">
    <img src="/images/exercise20(11).png" alt="Hello World Example" className="instructions-image" />
  </div>

  <p className="instructions-todo-description">
    with the value of <span className="highlight">point_total</span> where X is.
  </p>
  <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>You can combine strings by casting the numerical value to a string and using the + operator:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise20(12).png" alt="Hello World Example" className="instructions-image" />
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
  <div className={`feedback ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}>
    {Array.isArray(feedback) ? (
      feedback.map((msg, index) => (
        <p key={index} className="error-message">{msg}</p>
      ))
    ) : (
      <p>{feedback}</p>
    )}
  </div>
)}
          </div>
          {/* Hint Section */}
          
        </div>

        {/* Right Side: Code Editor */}
        
          <CodeEditor />
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
        <Link to="/exercise10">
                  <button className="back-button">← Back</button>
                </Link>
                <div className="footer-description">
    <p>11/11</p>
  </div>
        {isCorrect && (
                                                       <Link to="/dash">
                                                          <button className="next-button">Go Home!</button>
                                                        </Link>
                                          )}
      </div>
          
    </div>
  );
};

export default Exercise;
