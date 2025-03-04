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

           const starterCode = `nums = (16, 2, 19, 22, 10, 23, 16, 2, 27, 29, 19, 
           26, 12, 20, 16, 29, 6, 2, 12, 20)
   
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
            body: JSON.stringify({ code: userCode, exerciseId: "exercise33" }),
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
                exerciseId: "exercise33",
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
          <h2 className="instructions-title">1.3  Filter(), map() and reduce()</h2>

          <div className="instructions-description">
            <p>In this exercise, we will review the <span className="highlight">map()</span>, <span className="highlight">filter()</span>, and <span className="highlight">reduce()</span>, higher-order functions provided by Python. These functions accept an iterable and a processing function as arguments and return another iterable. </p>
            <p>The first function we will look at is <span className="highlight">filter()</span>, which converts the following imperative code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>into the following declarative code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p><span className="highlight">map()</span> converts the following imperative code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>Into the following declarative code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>The <span className="highlight">reduce()</span> function accepts an iterable and a two-parameter function (no more than two) known as an “accumulator”. It uses the accumulator to recursively process the contents of the iterable and “reduce” them to one value. An example application of <span className="highlight">reduce()</span> would be to compute the sum of all numbers in a list.</p>
            <p>The sum of all elements in a tuple written imperatively:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Using <span className="highlight">reduce()</span> to find the sum declaratively:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise33(5).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>The <span className="highlight">lambda</span> in <span className="highlight">reduce()</span> requires exactly two parameters.</p>
           
           <p>Higher-order functions are powerful tools that you can use to significantly shorten code, thereby leading to cleaner and more concise solutions. In later exercises, we will explore how to combine these functions.</p>
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Use <span className="highlight">filter()</span> to remove odd numbers from tuple <span className="highlight">nums</span>. Print your result using the following line of code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(6).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall the definition of <span className="highlight">filter()</span>:</p>
                <p><span className="highlight">filter(predicate, iterable)</span></p>
                <p>The predicate is a function that should check if a number is odd or not. Try using a lambda function!</p>
                <p>The iterable is the supplied tuple <span className="highlight">nums</span>.</p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">2.Using <span className="highlight">map()</span>m multiply all of the elements of <span className="highlight">nums</span> by 3. Print your result with the following line of code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(7).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall the <span className="highlight">map()</span> function looks like this:</p>
                <p><span className="highlight">map(function, iterable)</span></p>
                <p>Where function is a lambda and the iterable is tuple <span className="highlight">nums</span>.</p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">3. Find the sum of all the elements in the tuple <span className="highlight">nums</span> using the <span className="highlight">reduce()</span> function. Print your result with the following line of code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise33(8).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p><span className="highlight">reduce()</span> accepts a two-parameter lambda and an iterable.</p>
                <div className="instructions-image-container">
               <img src="/images/exercise33(9).png" alt="Hello World Example" className="instructions-image" />
                </div>
                <p>Remember to import <span className="highlight">reduce()</span> from the <span className="highlight">functools</span> library.</p>

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
                  <Link to="/exercise32">
                <button className="back-button">← Back</button>
              </Link>
              <div className="footer-description">
    <p>3/6</p>
  </div>
                    {isCorrect && (
                              <Link to="/exercise34">
                                <button className="next-button">Next Exercise →</button>
                              </Link>
                            )}
                  </div>
          
    </div>
  );
};

export default Exercise;
