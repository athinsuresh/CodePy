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
                          body: JSON.stringify({ code: userCode, exerciseId: "exercise10" }),
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
                              exerciseId: "exercise10",
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
          <h2 className="instructions-title">1.10 Value Error</h2>

          <div className="instructions-description">
            <p>Python automatically assigns a variable the appropriate datatype based on the value it is given. A variable with the value <span className="highlight">7</span> is an integer, <span className="highlight">7</span>. is a float, and <span className="highlight">"7"</span> is a string. Sometimes, we will want to convert variables to different datatypes. For example, if we wanted to print out an integer as part of a string, we would need to convert that integer to a string first. We can do that using <span className="highlight">str()</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>This would print:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Similarly, if we have the string <span className="highlight">"7"</span> and we want to perform arithmetic operations on it, we must convert it to a numeric datatype. We can do this using <span className="highlight">int()</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>If we have a string that is a floating point value, such as <span className="highlight">"7.5"</span>, we can convert it to a numeric datatype using <span className="highlight">float()</span> instead:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-image-container">
               <img src="/images/exercise20(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Using <span className="highlight">float()</span> on an integer value, whether string or numeric, will convert the value to a float:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(5).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-image-container">
               <img src="/images/exercise20(6).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>The result of using <span className="highlight">int()</span> on a floating point value will depend on whether the value is a string or numeric datatype. If you use <span className="highlight">int()</span> on a floating point string value, it will raise a <span className="highlight">ValueError</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(7).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-image-container">
               <img src="/images/exercise20(8).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Using <span className="highlight">int()</span> on a floating point numeric value converts the number to an integer by removing the decimal portion and rounding the number closer towards 0:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise20(9).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <div className="instructions-image-container">
               <img src="/images/exercise20(10).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Note: Use caution when converting a floating point number into an integer, as this may result in the loss of the decimal data.</p>


            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1.  
            Create a variable called <span className="highlight">product</span> that contains the result of multiplying the float value of <span className="highlight">float_1</span> and <span className="highlight">float_2</span>.</p>

<p className="instructions-todo-description-question">2.  
Create a string called <span className="highlight">big_string</span> that says:</p>
<div className="instructions-image-container">
               <img src="/images/exercise20(11).png" alt="Hello World Example" className="instructions-image" />
           </div>

<p className="instructions-todo-description">with the value of <span className="highlight">product</span> where the X is.</p>
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
  <p
    className={`feedback ${isCorrect ? "correct-feedback" : "wrong-feedback"}`}
    dangerouslySetInnerHTML={{ __html: feedback }}
  ></p>
)}
          </div>

          {/* Hint Section */}
          
        </div>

        {/* Right Side: Code Editor */}
        
          <CodeEditor />
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
        <Link to="/exercise9">
                  <button className="back-button">← Back</button>
                </Link>
                <div className="footer-description">
    <p>10/11</p>
  </div>
        {isCorrect && (
                                               <Link to="/exercise11">
                                                  <button className="next-button">Next Exercise →</button>
                                                </Link>
                                  )}
      </div>
          
    </div>
  );
};

export default Exercise;
