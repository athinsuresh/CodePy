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
        body: JSON.stringify({ code: userCode, exerciseId: "exercise21" }),
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
            course: "course2",
            exerciseId: "exercise21",
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
      <div className="exercise-container-intermediate">
        {/* Left Side: Instructions */}
        <div className="instructions-container">
          <h2 className="instructions-title">1.1 Variable number of arguments: *args</h2>

          <div className="instructions-description">
            <p>To start exploring variable argument lengths in Python functions, let’s take a look at a familiar function we have been using for a long time:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise21.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Notice how the <span className="highlight">print()</span> function does not care how many arguments we pass to it. It has no expectation that we are going to pass in one argument or even a million! So the question is, how does <span className="highlight">print()</span> accomplish this?</p>
           <p>Well, in Python, there is an additional operator called the unpacking operator (*). The unpacking operator allows us to give our functions a variable number of arguments by performing what’s known as positional argument packing.</p>
           <p>Let’s explore how it works by examining a basic function that utilizes the unpacking operator:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise21(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>If we called this function with random arguments:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise21(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Our output would show us what is inside of <span className="highlight">*args</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise21(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Notice the two things:</p>
           <p>1. In our <span className="highlight">print()</span> call, we simply use the name of <span className="highlight">args</span> with the unpacking operator omitted. The name of <span className="highlight">args</span> is completely arbitrary, and this example works just the same:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise21(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>2. Whatever name follows the unpacking operator <span className="highlight">(*)</span> will store the arguments passed into the function in the form of a tuple. This allows our functions to accept any number of arguments just like the <span className="highlight">print()</span> function we examined earlier. In this case, <span className="highlight">args</span> has three values inside, but it can have many more (or fewer).</p>
           <p>Let’s practice using the unpacking operator for positional arguments in a function!</p>
           
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. Jiho wants to expand our restaurant application to also take orders from customers. This is the perfect time to use the unpacking operator since we never know how many items customers are going to order.</p>
            <p className="instructions-todo-description">   To start, we want to build a function that will compile a list of all the items a customer wants to order and then print it out. This will help our kitchen know what to cook.</p>
            <p className="instructions-todo-description">   Define a function called <span className="highlight">print_order()</span> that will take in a variable number of arguments using a parameter called <span className="highlight">order_items</span>. The function should simply print <span className="highlight">order_items</span>.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>For a function to take in a variable number of arguments, we use the unpacking operator (*). Here is an example function utilizing it with a parameter called <span className="highlight">args</span>:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise21(5).png" alt="Hello World Example" className="instructions-image" />
           </div>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">2. Looks like our first order came in! Call our function <span className="highlight">print_order()</span> with the following order items:</p>
          <li><span className="highlight">'Orange Juice'</span></li>
          <li><span className="highlight">'Apple Juice'</span></li>
          <li><span className="highlight">'Scrambled Eggs'</span></li>
          <li><span className="highlight">'Pancakes'</span></li>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>When using the unpacking operator (*) we can pass arguments in any order!</p>
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
  <p
    className={`feedback ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}
    dangerouslySetInnerHTML={{ __html: feedback }}
  ></p>
)}
          </div>
        </div>
        

        {/* Right Side: Code Editor */}
        <CodeEditor/>
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
      <div className="footer-description">
    <p>1/5</p>
  </div>
        {isCorrect && (
          <Link to="/exercise22">
            <button className="next-button">Next Exercise →</button>
          </Link>
        )}
      </div>
          
    </div>
  );
};

export default Exercise;
