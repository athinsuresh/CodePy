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
                 const starterCode = `# Hi! I'm Maria and I live in main.py.
# I'm an expert Python coder.
# I'm 21 years old and I plan to program cool stuff forever.`;

              
const handleSubmit = async () => {
  const userData = localStorage.getItem("user"); 
  console.log("🔍 Raw user data from localStorage:", userData);
  const response = await fetch("http://localhost:5000/validate-solution", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ code: userCode, exerciseId: "exercise9" }),
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
          exerciseId: "exercise9",
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
          <h2 className="instructions-title">1.9  Boolean</h2>

          <div className="instructions-description">
            <p>Sometimes we have a need for variables that are either true or false. This datatype, which can only ever take one of two values, is called a <span className="highlight">boolean</span>. In Python, we define booleans using the keywords <span className="highlight">True</span> and <span className="highlight">False</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise19.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>A boolean is actually a special case of an integer. A value of <span className="highlight">True</span> corresponds to an integer value of 1, and will behave the same. A value of <span className="highlight">False</span> corresponds to an integer value of 0.</p>
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question-question">1. Someone has introduced themselves to you using comments in main.py.

Read the comments and then create a variable called <span className="highlight">age_is_12</span> and set it to be <span className="highlight">True</span> or <span className="highlight">False</span> depending on if this person’s age is 12.</p>
            <div className="instructions-image-container">
               <img src="/images/exercise19(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>To set a boolean to True, you would use:</p>
                <div className="instructions-image-container">
                    <img src="/images/exercise19(2).png" alt="Hello World Example" className="instructions-image"/>
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
        <Link to="/exercise8">
                  <button className="back-button">← Back</button>
                </Link>
                <div className="footer-description">
    <p>9/11</p>
  </div>
         {isCorrect && (
                                       <Link to="/exercise10">
                                          <button className="next-button">Next Exercise →</button>
                                        </Link>
                          )}
      </div>
          
    </div>
  );
};

export default Exercise;
