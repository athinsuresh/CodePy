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

           const starterCode = `\"\"\" 
def squared(x):
  return x * x

def cubed(x):
  return x*x*x
\"\"\"

def odd_or_even(n, even_function, odd_function):
  pass # Remove this statement for Checkpoint 1.

# Checkpoint 2 code goes here.

# Checkpoint 3 code goes here.

#print(test) # Uncomment the print function to see the results of Checkpoint 3.`;

        
const handleSubmit = async () => {
  const userData = localStorage.getItem("user"); 
  console.log("🔍 Raw user data from localStorage:", userData);
  const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ code: userCode, exerciseId: "exercise32" }),
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
          exerciseId: "exercise32",
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
          <h2 className="instructions-title">1.2  Lambda Functions</h2>

          <div className="instructions-description">
            <p>Lambda functions are crucial in functional programming as they allow the production of neat and concise functions that require other functions as an argument.</p>
            <p>A lambda function is a short anonymous function that can accept several parameters but only returns one value. Lambdas can be stored as a variable or defined inline in the accepting function.</p>
            <p>Consider the following example:</p>
            <p>We determine the cost of a two-dimensional sheet of metal by multiplying the price per square-meter times the area of the sheet. We can cut the sheet into either a rectangle or a triangle. To model this, let’s write a general function in Python that calculates the price of a sheet of metal. The function will accept the following parameters:</p>
            <ul>
              <li>price per square meter</li>
              <li>a tuple of dimensions</li>
              <li>a function to compute area. The function will return the price of a sheet of metal. </li>
            </ul>
            <p>Recall from geometry:</p>
            <ul>
              <li>Area of a triangle: 0.5 * (base * height)</li>
              <li>Area of a rectangle: base * height</li>
            </ul>
            <p>Writing the function without lambdas, we have:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise32.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>To make the code shorter, we can replace the <span className="highlight">rect(b,h)</span> and the <span className="highlight">tri(b,h)</span> functions with lambdas like so:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise32(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Lambda functions can be stored in a variable like so:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise32(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Lambdas are a very powerful tool in Python. However, they have a drawback in that they are only suited for “short and fast” functions. Long, complicated functions cannot be written as lambdas.</p>
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Complete the <span className="highlight">odd_or_even()</span> function provided. The body of the function will return <span className="highlight">even_function(n)</span> if <span className="highlight">n</span> is even and return <span className="highlight">odd_function(n)</span> if <span className="highlight">n</span> is odd.</p>
            
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>You can use an <span className="highlight">if</span> block to check whether <span className="highlight">n</span> is even or not.</p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">2.Convert the functions <span className="highlight">squared(x)</span> and <span className="highlight">cubed(x)</span> into lambdas stored in variables called <span className="highlight">square</span> and <span className="highlight">cube</span> respectively.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Recall the example to store the <span className="highlight">rect(b,h)</span> and <span className="highlight">tri(b, h)</span> functions in variables:</p>
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">3. For this checkpoint, odd numbers are to be squared and even numbers are to be cubed! Create a variable called <span className="highlight">test</span> and set it to <span className="highlight">odd_or_even()</span> with <span className="highlight">n</span>n being 5 and pass in <span className="highlight">square</span> and <span className="highlight">cube</span> in the appropriate locations.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>In this case, the lambdas are already stored in variables; you can just pass the variable name in for the functions.</p>
                <div className="instructions-image-container">
               <img src="/images/exercise32(4).png" alt="Hello World Example" className="instructions-image" />
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
                  <Link to="/exercise31">
                <button className="back-button">← Back</button>
              </Link>
              <div className="footer-description">
    <p>2/6</p>
  </div>
                    {isCorrect && (
                              <Link to="/exercise33">
                                <button className="next-button">Next Exercise →</button>
                              </Link>
                            )}
                  </div>
          
    </div>
  );
};

export default Exercise;
