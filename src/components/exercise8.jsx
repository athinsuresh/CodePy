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
                    body: JSON.stringify({ code: userCode, exerciseId: "exercise8" }),
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
                        exerciseId: "exercise8",
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
          <h2 className="instructions-title">1.8 Two Types of Division</h2>

          <div className="instructions-description">
            <p>In Python 2, when we divide two integers, we get an integer as a result. When the quotient is a whole number, this works fine:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise18.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>However, if the numbers do not divide evenly, the result of the division is truncated into an integer. In other words, the quotient is rounded down to a whole number. This can be surprising when you expect to receive a decimal and you receive a rounded-down integer:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise18(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>To yield a float as the result instead, programmers often change either the numerator or the denominator (or both) to be a <span className="highlight">float</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise18(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>An alternative way is to use the <span className="highlight">float()</span> method:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise18(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1.  
You have come home from the grocery store with 100 cucumbers to split amongst yourself and your 5 roommates (6 people total).  
Create a variable <span className="highlight">cucumbers</span> that holds 100 and <span className="highlight">num_people</span> that holds 6.</p>

<p className="instructions-todo-description-question">2.  
Create a variable called <span className="highlight">whole_cucumbers_per_person</span> that is the integer result of dividing <span className="highlight">cucumbers</span> by <span className="highlight">num_people</span>.  
Print <span className="highlight">whole_cucumbers_per_person</span> to the console.</p>

<p className="instructions-todo-description-question">3.  
You realize that the numbers don’t divide evenly and you don’t want to throw out the remaining cucumbers.  
Create a variable called <span className="highlight">float_cucumbers_per_person</span> that holds the float result of dividing <span className="highlight">cucumbers</span> by <span className="highlight">num_people</span>.  
Print <span className="highlight">float_cucumbers_per_person</span> to the console.</p>
<div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>You can do float division by casting either the numerator or denominator as a float:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise18(4).png" alt="Hello World Example" className="instructions-image" />
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
      <div className="footer-description">
    <p>8/11</p>
  </div>
        <Link to="/exercise7">
                  <button className="back-button">← Back</button>
                </Link>
        {isCorrect && (
                               <Link to="/exercise9">
                                  <button className="next-button">Next Exercise →</button>
                                </Link>
                  )}
      </div>
          
    </div>
  );
};

export default Exercise;
