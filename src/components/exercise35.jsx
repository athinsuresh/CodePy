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

fruits = {
    "Grape": (4, 6, 2),
    "Lemon": (7, 3, 1),
    "Orange": (5, 8, 1),
    "Apple": (2, 8, 10),
    "Watermelon": (0, 9, 6)
}

# Code for Checkpoint 1 goes here.
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
      body: JSON.stringify({ code: userCode, exerciseId: "exercise35" }),
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
          exerciseId: "exercise35",
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
          <h2 className="instructions-title">1.5  Reducing a Mapped Collection</h2>

          <div className="instructions-description">
            <p>In this exercise, we will be focussing on the benefits of using <span className="highlight">reduce()</span> and <span className="highlight">map()</span> together. </p>
            <p>Consider the example of having a dictionary representing a cost of an item sale called <span className="highlight">costs</span> which maps an item name to a tuple containing the total number of units sold and the price per unit. A dictionary entry would look like this:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise35.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>We wish to find the total cost of all items sold. If this were a list or a tuple, we could simply apply <span className="highlight">reduce()</span> on it to find the sum. This, however, would present a problem if we attempt this with a dictionary.</p>
            <p>The lambda provided to <span className="highlight">reduce()</span> requires that the two parameters and the returned value be of the same type. For example, in the lambda <span className="highlight">lambda x, y: x*y</span>, the x, y, and return type are all integers. As you can see, you cannot directly reduce a dictionary to a number because they are not of the same type; we must process the data in the dictionary first.</p>
            <p>We can use <span className="highlight">map()</span> to iterate through the dictionary and compute the cost of every item sold. We can potentially store this in a tuple and then reduce that tuple to a single number, the total cost.</p>
            <p>Let’s look at an example with the following program:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise35(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>This dictionary is passed into <span className="highlight">map()</span> along with the lambda <span className="highlight">lambda q: costs[q][0] * costs[q][1]</span>. The lambda function takes the price tuple and generates a total_cost_per_item by multiplying the <span className="highlight">number_of_units_sold (costs[q][0])</span>  by the <span className="highlight">price_per_unit_GBP (costs[q][1])</span>. The lambda in the <span className="highlight">reduce()</span> function is now working strictly with integers to sum them up and returns a total cost of £537.</p>
            
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. The dictionary provided represents the number of a given fruit sold over three days - a dictionary entry is:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise35(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p className="instructions-todo-description">Using <span className="highlight">reduce()</span> and <span className="highlight">map()</span>, find the total number of fruits sold. Store this answer in a variable called total_fruits. Make sure to print out your solution.</p>
           
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>The parameters and return value in the <span className="highlight">reduce()</span> function’s lambda must all be of the same type. To do this, we must sum up the values in the dictionary entries to produce one number for each entry: the total number of each fruit sold. We can do this using <span className="highlight">map()</span>. Recall that we did this in the example provided earlier like so:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise35(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
                <p>In this case, the <span className="highlight">reduce()</span> function must add the three values for each entry in <span className="highlight">fruits</span>.</p>
                <p><span className="highlight">reduce()</span> is used to add up each total</p>
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
    <p>5/6</p>
  </div>
                    {isCorrect && (
                              <Link to="/exercise36">
                                <button className="next-button">Next Exercise →</button>
                              </Link>
                            )}
                  </div>
          
    </div>
  );
};

export default Exercise;
