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

           const starterCode = `from collections import namedtuple

# Checkpoint 1 code goes here.

# Checkpoint 2 code goes here.

# Checkpoint 3 code goes here.`;

        
const handleSubmit = async () => {
  const userData = localStorage.getItem("user"); 
  console.log("🔍 Raw user data from localStorage:", userData);
  const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ code: userCode, exerciseId: "exercise31" }),
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
          course: "course3",
          exerciseId: "exercise31",
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
      <div className="exercise-container-advanced">
        {/* Left Side: Instructions */}
        <div className="instructions-container">
          <h2 className="instructions-title">1.1  Immutable Data Types</h2>

          <div className="instructions-description">
            <p>Immutable data types are important to use in functional programming as they offer advantages, such as:</p>
            <ul>
              <li>Thread-safe data manipulation</li>
              <li>Preventing programmers from accidentally changing a value</li>
            </ul>
            <p>We can create a tuple of tuples with a mix of datatypes, like the following:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise31(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>This is a great way to store our mixed data. However, there is room for improvement. The student tuple contains records of students in a CS class where each tuple stores the student’s name, age, and the grade they received. Defining a tuple in this manner is prone to errors as it requires the programmer to remember the position of each piece of data in the tuple.</p>
           <p>Instead, we can use a namedtuple data type from the <span className="highlight">collections</span> library like so:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise31(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>We access the student information:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise31(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Take note that the name of the tuple and the variable that stores the tuple must be identical.</p>
           <p>We can package three student tuples neatly into a tuple called <span className="highlight">students</span> like so:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise31(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>The programmer is no longer required to remember the position of each piece of data as they can reference it using the property name.</p>
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Create a <span className="highlight">namedtuple</span> called <span className="highlight">country</span>country to represent a country. It should contain fields to represent the name of a country, its capital, and the continent on which it is located.</p>
            <p className="instructions-todo-description">The  <span className="highlight">country</span>tuple should contain <span className="highlight">name</span>, <span className="highlight">capital</span>, and <span className="highlight">continent</span> as fields.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall the example of creating a namedtuple for a record of students:</p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">2. Create three tuples that represent the following countries:</p>
            <p className="instructions-todo-description"><ul>
              <li>France: capital: Paris, continent: Europe</li>
              <li>Japan: capital: Tokyo, continent: Asia</li>
              <li>Senegal: capital: Dakar, continent: Africa</li>
            </ul>
            </p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall from the example that a tuple representing a student (name, age, and grade) </p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description">The country name should be used as the variable name. Note that your capitalization does not matter, so you can define the France variable as <span className="highlight">France</span>, and you can define its "capital" as <span className="highlight">"Paris"</span>.</p>
            <p className="instructions-todo-description-question">3. Pack all three countries into a tuple named <span className="highlight">countries</span></p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall the packing of the student’s records was done like so: </p>
                <div className="instructions-image-container">
               <img src="/images/exercise31(4).png" alt="Hello World Example" className="instructions-image" />
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
    <p>1/6</p>
  </div>
              {isCorrect && (
                <Link to="/exercise32">
                  <button className="next-button">Next Exercise →</button>
                </Link>
              )}
            </div>
          
    </div>
  );
};

export default Exercise;
