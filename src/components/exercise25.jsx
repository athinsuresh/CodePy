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
        body: JSON.stringify({ code: userCode, exerciseId: "exercise25" }),
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
            exerciseId: "exercise25",
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
          <h2 className="instructions-title">1.5 All together now!</h2>

          <div className="instructions-description">
            <p>So far we have seen how both <span className="highlight">*args</span> and <span className="highlight">**kwargs</span> can be combined with standard arguments. This is useful, but in some cases, we may want to use all three types together! Thankfully Python allows us to do so as long as we follow the correct order in our function definition. The order is as follows:</p>
            <li>Standard positional arguments</li>
            <li><span className="highlight">*args</span></li>
            <li>Standard keyword arguments</li>
            <li><span className="highlight">**kwargs</span></li>
            <p>As an example, this is what our function definition might look like if we wanted a function that printed animals utilizing all three types:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise25.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>We could call our function like so:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise25(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>And our result would be:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise25(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>That is a whole lot of arguments! Let’s break it down:</p>
           <li>The first two arguments that our function accepts will take the form of standard positional arguments. When we call the function, the first two values provided will map to <span className="highlight">animal1</span> and <span className="highlight">animal2</span>. Thus, the first line of output is <span className="highlight">Snake Fish</span></li>
           <li>The non-keyword arguments that follow after <span className="highlight">Snake</span> and <span className="highlight">Fish</span> in our function call are all mapped to the <span className="highlight">args</span> tuple. Thus, our result is <span className="highlight">('Guinea Pig', 'Owl')</span>.</li>
           <li>Then we transition to regular keyword arguments. Since we called <span className="highlight">animal4</span> as a keyword, our result for the print statement is <span className="highlight">Cat</span></li>
           <li>Lastly, we have one more keyword argument that is mapped to <span className="highlight">**kwargs</span>. Thus, our last line of output is <span className="highlight">{JSON.stringify({ animal_5: 'Dog' })}</span></li>
           <p>Let’s practice putting it all together in our restaurant application for Jiho!</p>
           
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. For an upcoming holiday, Jiho plans on making a prix fixe menu for the restaurant. Customers at the restaurant will be able to choose the following:</p>
            <li>1 Appetiser</li>
            <li>2 Entrees</li>
            <li>1 Side Dish</li>
            <li>2 Scoops of different ice cream flavors for dessert.</li>

            <p className="instructions-todo-description">To accomplish all these choices, we are going to utilize the different types of arguments that we have learned so far.</p>
            <p className="instructions-todo-description-question">2. Let’s start by defining a function called <span className="highlight">single_prix_fixe_order()</span> which will define four parameters to accept the full order:</p>
            <li>A parameter named <span className="highlight">appetiser</span>.</li>
            <li>A parameter named <span className="highlight">entrees</span> paired with a <span className="highlight">*</span> operator.</li>
            <li>A paramter named <span className="highlight">sides</span></li>
            <li>A parameter named <span className="highlight">dessert_scoops</span> paired with a <span className="highlight">**</span> operator</li>
            <p className="instructions-todo-description">Our function should simply have four <span className="highlight">print()</span> statements that print each individual parameter.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Our function should take this base form:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise25(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">3. We got our first prix fixe order in! The customer wants the following:</p>
          <li><span className="highlight">'Baby Beets'</span> as an appetizer</li>
          <li><span className="highlight">'Salmon'</span> and <span className="highlight">'Scallops'</span> as entrees</li>
          <li><span className="highlight">'Mashed Potatoes'</span> as a side</li>
          <li>A scoop of <span className="highlight">'Vanilla'</span> ice cream and a scoop of <span className="highlight">'Cookies and Cream'</span> for dessert</li>
          <p className="instructions-todo-description">Utilize our function <span className="highlight">single_prix_fixe_order()</span> to print out all of the customers order.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Call <span className="highlight">single_prix_fixe_order()</span> with arguments in this order:</p>
                <li>Standard positional arguments</li>
            <li><span className="highlight">*args</span></li>
            <li>Standard keyword arguments</li>
            <li><span className="highlight">**kwargs</span> The keyword names for <span className="highlight">dessert_scoops</span> can be arbitrary but we do have to define a keyword argument called <span className="highlight">sides</span>!</li>
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
        </div>
        

        {/* Right Side: Code Editor */}
        <CodeEditor/>
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
        <Link to="/exercise24">
                        <button className="back-button">← Back</button>
                      </Link>
                      <div className="footer-description">
    <p>5/5</p>
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
