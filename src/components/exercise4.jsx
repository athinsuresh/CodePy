import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/exercise.css";
import CodeEditor from "./CodeEditor";
import { Link } from "react-router-dom";
import CodeSnippet from "./CodeSnippet";

const Exercise = () => {
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate(); // For navigating to the next exercise

   const [userCode, setUserCode] = useState(""); // Store user input
     const [isCorrect, setIsCorrect] = useState(false);
     const [feedback, setFeedback] = useState("");

     const starterCode='print(You take away its chair)'
  
     const handleSubmit = async () => {
      const userData = localStorage.getItem("user"); 
      console.log("🔍 Raw user data from localStorage:", userData);
      const response = await fetch("http://localhost:5000/validate-solution", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}` 
          },
          body: JSON.stringify({ code: userCode, exerciseId: "exercise4" }),
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
              exerciseId: "exercise4",
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
          <h2 className="instructions-title">1.4 Handling Errors</h2>

          <div className="instructions-description">
            <p>As we get more familiar with the Python programming language, we run into 
errors
 and exceptions. These are complaints that Python makes when it doesn’t understand what you want it to do. Everyone runs into these issues, so it is a good habit to read and understand them. Here are some common errors that we might run into when printing strings:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise14.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-image-container">
               <img src="/images/exercise14(1).png" alt="Hello World Example" className="instructions-image" />
           </div>


           <p>This means that a string wasn’t closed, or wasn’t closed with the same quote-character that started it.

Another issue you might run into is attempting to create a string without quotes at all. Python treats words not in quotes as commands, like the print statement. If it fails to recognize these words as defined (in Python or by your program elsewhere) Python will complain the code has a <span className="highlight">NameError</span>. This means that Python found what it thinks is a command, but doesn’t know what it means because it’s not defined anywhere.</p>
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
           return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. We’ve written a print statements that will raise error. It has no quotes at all.</p>
            <div className="instructions-image-container">
               <img src="/images/exercise14(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p className="instructions-todo-description">Fix the the print statement to successfully debug the program!</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              
              <div className="hint-content">
              <p>Hint: A print statement should start with the word print and then should have the message inside matching quote marks.</p>
            </div>

              
            )}
          </div>
          </div>

          {/* Hint Section */}
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
            <Link to="/exercise3">
          <button className="back-button">← Back</button>
        </Link>
        <div className="footer-description">
    <p>4/11</p>
  </div>
              {isCorrect && (
                        <Link to="/exercise5">
                          <button className="next-button">Next Exercise →</button>
                        </Link>
                      )}
            </div>
    </div>
  );
};

export default Exercise;
