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

           const starterCode = `from functools import reduce

costs = {
    "shirt": (4, 13.00),
    "shoes": (2, 80.00),
    "pants": (3, 100.00),
    "socks": (5, 5.00),
    "ties": (3, 14.00),
    "watch": (1, 145.00)
}

nums = (24, 6, 7, 16, 8, 2, 3, 11, 21, 20, 22, 23, 19, 12, 1, 4, 17, 9, 25, 15)

# Code for Checkpoint 1 goes here.

print(total)

product = -1

# Code for Checkpoint 2 goes here.

print(product)
`;

        
const handleSubmit = async () => {
  const userData = localStorage.getItem("user"); 
  console.log("🔍 Raw user data from localStorage:", userData);
  const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ code: userCode, exerciseId: "exercise36" }),
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
          exerciseId: "exercise36",
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
          <h2 className="instructions-title">1.6  Combining all Three Higher-Order Functions</h2>

          <div className="instructions-description">
            <p>Now that you’ve learned how to combine any two functions, let’s see how (and why) we can combine all three! A reason for doing this would be when you need to “filter” a collection before you “map” it (or “map” then “filter”) and then “reduce” it to a single number. To illustrate this in practice, let’s revisit the inventory problem from earlier, but this time we are only interested in the total sum of prices of items that sold for less than a certain value. </p>
            <p>In this Python exercise, we are given the record of items represented by a dictionary. We are interested in the total sum of prices of items that sold for less than £150. We do this by:</p>
            <ul>
                <li>First “map” the items their individual total cost ((number of units sold) * (price per unit)).</li>
                <li>Then eliminate (“filter” out) all items that cost more than £150.</li>
                <li>Then “reduce” the individual costs to a single number that represents the total cost of the items.</li>
            </ul>
            <p>We can do this with the following code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise36.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>The focus of the code is</p>
            <div className="instructions-image-container">
               <img src="/images/exercise36(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>This first computes the total cost of each item using <span className="highlight">map()</span>:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise36(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Then <span className="highlight">filter()</span> is used to eliminate all items that cost more than £150:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise36(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Then <span className="highlight">reduce()</span> is used to compute the total sum:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise36(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>This example demonstrates how to use the three functions together.</p>
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Given the record of item sales <span className="highlight">costs</span>, find the total cost of items that cost more than £150. Assign the answer to variable <span className="highlight">total</span>. Make sure to print out your solution. Use all three higher-order functions for this exercise.</p>
           
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>In this situation, <span className="highlight">filter()</span> has to eliminate values that cost £150 or less.</p>
                <p>Recall that <span className="highlight">filter()</span> removed values that cost more than £150 like so:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise36(6).png" alt="Hello World Example" className="instructions-image" />
           </div>
                <p>Modify the filter predicate to eliminate the items that cost more than £150 (items that cost £150 should not be included).</p>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">2. Given the tuple <span className="highlight">nums</span>, use <span className="highlight">map()</span>, <span className="highlight">filter()</span>, and <span className="highlight">reduce()</span> to find all numbers less than 10, add five to them, and find their total product. Assign the answer to variable <span className="highlight">product</span>product. Make sure to print out your solution.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Use <span className="highlight">filter()</span> to remove values less than 10.</p>
                <p>Use <span className="highlight">map()</span> to add 5 to all filtered values.</p>
                <p>Use <span className="highlight">reduce()</span> to compute the product.</p>
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
                  <Link to="/exercise34">
                <button className="back-button">← Back</button>
              </Link>
              <div className="footer-description">
    <p>6/6</p>
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
