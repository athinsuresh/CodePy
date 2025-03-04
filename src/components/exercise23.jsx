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
   const starterCode = `tables = {
    1: {
      'name': 'Chioma',
      'vip_status': False,
      'order': {
        'drinks': 'Orange Juice, Apple Juice',
        'food_items': 'Pancakes'
      }
    },
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {}
  }
  print(tables)
  
  # Write your code below: 
  
  # Example Call
  # assign_food_items(food='Pancakes, Poached Egg', drinks='Water')`;
  

  const handleSubmit = async () => {
    const userData = localStorage.getItem("user"); 
    console.log("🔍 Raw user data from localStorage:", userData);
    const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ code: userCode, exerciseId: "exercise23" }),
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
            exerciseId: "exercise23",
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
      <div className="exercise-container-intermediate">
        {/* Left Side: Instructions */}
        <div className="instructions-container">
          <h2 className="instructions-title">1.3 Variable number of arguments: **kwargs</h2>

          <div className="instructions-description">
            <p>Python doesn’t stop at allowing us to accept unlimited positional arguments; it also gives us the power to define functionswith unlimited keyword arguments. The syntax is very similar but uses two asterisks <span className="highlight">**</span> instead of one. We typically call these <span className="highlight">kwargs</span> as a shorthand for keyword arguments.</p>
            <p>Let’s examine a function that prints out some useful information about <span className="highlight">kwargs</span> to see it in action:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise23.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Would output:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise23(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>We can observe two things:</p>
           <p>1. <span className="highlight">**kwargs</span> takes the form of a dictionary with all the keyword argument values passed to <span className="highlight">arbitrary_keyword_kwargs</span>. Since <span className="highlight">**kwargs</span> is a dictionary, we can use standard dictionary functions like <span className="highlight">.get()</span> to retrieve values.</p>
           <p>2. Just as we saw with <span className="highlight">*args</span>, the name of <span className="highlight">kwargs</span> is completely arbitrary, and this example works exactly the same with the name becoming <span className="highlight">data</span>:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise23(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Let’s practice using <span className="highlight">**kwargs</span> to get a feel of how it works in a function!</p>
           
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Jiho is pleased with how we can store orders for our tables. However, the staff now wants to distinguish between food items and drinks.</p>
            <p className="instructions-todo-description">   Since food items get prepared in the kitchen and drinks are prepared at the bar, it’s important to distinguish between the two in our application.</p>
            <p className="instructions-todo-description">   The <span className="highlight">tables</span> dictionary has been changed to support the staff’s requests. Take some time to examine the changed structure.</p>
            <p className="instructions-todo-description">   Run the code to move on to the next checkpoint!</p>
            <p className="instructions-todo-description-question">2. Since our program now requires a distinction between food items and drinks, this is a great place to utilize the power of <span className="highlight">**kwargs</span>.</p>
            <p className="instructions-todo-description">   Define a function called <span className="highlight">assign_food_items()</span> that has one parameter, <span className="highlight">order_items</span>. Pair this parameter with a <span className="highlight">**</span> operator to handle any keyword arguments. For now, just have the function print <span className="highlight">order_items</span>.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>For a function to take in a variable number of arguments, we use the <span className="highlight">**</span> operator. Here is an example function utilizing it with a parameter called <span className="highlight">kwargs</span>:</p>
                <div className="instructions-image-container">
                <img src="/images/exercise23(3).png" alt="Hello World Example" className="instructions-image" />
                </div>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">3. Now we want to capture the food items and drinks in <span className="highlight">order_items</span>.. Use the <span className="highlight">.get()</span> method to do the following:</p>
          <li>
          Capture the values from a keyword argument called food and assign it to a variable called <span className="highlight">food</span>.
          </li>
          <li>Capture the values from a keyword argument called drinks and assign it to a variable called <span className="highlight">drinks</span></li>
          <p className="instructions-todo-description">Refer to the commented example call at the bottom of the script for a reference on how we will call this function later on.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>The <span className="highlight">.get()</span> method allows us to capture the arguments used when working with <span className="highlight">**kwargs</span>. </p>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">4. Lastly, inside of our function use <span className="highlight">print()</span> to output the food variable and another <span className="highlight">print()</span> to output the <span className="highlight">drinks</span> variable.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Call <span className="highlight">print()</span> twice</p>
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
                              <Link to="/exercise22">
                            <button className="back-button">← Back</button>
                          </Link>
                          <div className="footer-description">
    <p>3/5</p>
  </div>
                                {isCorrect && (
                                          <Link to="/exercise24">
                                            <button className="next-button">Next Exercise →</button>
                                          </Link>
                                        )}
                              </div>
          
    </div>
  );
};

export default Exercise;
