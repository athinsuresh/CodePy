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
  
  def assign_table(table_number, name, vip_status=False): 
    tables[table_number]['name'] = name
    tables[table_number]['vip_status'] = vip_status
    tables[table_number]['order'] = {}
  
  assign_table(2, 'Douglas', True)
  print('--- tables with Douglas ---', tables)
  
  def assign_food_items(**order_items):
    food = order_items.get('food')
    drinks = order_items.get('drinks')
    # tables[table_number]['order']['food_items'] = food
    # tables[table_number]['order']['drinks'] = drinks
  
  print('\\n --- tables after update --- \\n')`;
  


  const handleSubmit = async () => {
    const userData = localStorage.getItem("user"); 
    console.log("🔍 Raw user data from localStorage:", userData);
    const response = await fetch("http://localhost:5000/validate-solution", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ code: userCode, exerciseId: "exercise24" }),
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
            exerciseId: "exercise24",
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
          <h2 className="instructions-title">1.4 Working with **kwargs</h2>

          <div className="instructions-description">
            <p>Working with <span className="highlight">**kwargs</span> looks very similar to its <span className="highlight">*args</span> counterpart. Since <span className="highlight">**</span> generates a standard dictionary, we can use iteration just like we did earlier by taking advantage of the <span className="highlight">.values()</span> method. Here is an example:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise24.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Would output:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise24(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>We can also combine our use of <span className="highlight">**</span> with regular positional arguments. However, Python requires that all positional arguments come first in our function definition. Let’s examine how this works:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise24(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Would output:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise24(3).png" alt="Hello World Example" className="instructions-image" />
           </div>

           <p> If we were to switch the position of <span className="highlight">positional_arg</span> to come after <span className="highlight">**data</span>, we would be met with a <span className="highlight">SyntaxError</span>.</p>
           <p>Let’s expand our restaurant application from the previous exercises to apply the flexibility of using <span className="highlight">**kwargs</span> in our functions.</p>
           
            <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. In the last exercise, we saw how using <span className="highlight">**</span> allowed us to capture different food items that a table will order. In the next few checkpoints, we will finish implementing the functionality of our <span className="highlight">assign_food_items()</span> function.</p>
            <p className="instructions-todo-description">Take some time to get reacquainted with the program. Note the changes in the <span className="highlight">assign_food_items()</span> function.</p>
            <p className="instructions-todo-description">Run the code to move on</p>
            <p className="instructions-todo-description-question">2. Unfortunately, when we originally implemented <span className="highlight">assign_food_items()</span> we did not assign the values we capture into our <span className="highlight">tables</span> dictionary.</p>
            <p className="instructions-todo-description">Adjust the function definition of <span className="highlight">assign_food_items()</span>:</p>
            <li>Add a positional parameter called <span className="highlight">table_number</span> followed by the <span className="highlight">**order_items</span> parameter we already defined.</li>
            <li>Uncomment the 2 lines inside the function.</li>
            <p className="instructions-todo-description">Adding the parameter and uncommenting the lines will now allow us to assign the food to a specific table.</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>If we want to use positional arguments in combination with <span className="highlight">**kwargs</span>, we have to make sure the positional argument comes first in the function definition:</p>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">3. Great! Now that we have the base functionality set up, let’s give it a test run. Luckily a new customer named Douglas just came in and is ready to place an order.</p>
          <p className="instructions-todo-description">Under <span className="highlight">print('\n --- tables after update --- \n')</span>, call the <span className="highlight">assign_food_items()</span> function with the following arguments:</p>
          <li>A positional argument <span className="highlight">table_number</span> with the value <span className="highlight">2</span></li>
          <li>A keyword argument <span className="highlight">food</span> with the value <span className="highlight">'Seabass, Gnocchi, Pizza'</span>'</li>
          <li>A keyword argument <span className="highlight">drinks</span> with the value <span className="highlight">'Margarita, Water'</span>'</li>
          <p className="instructions-todo-description">Print <span className="highlight">tables</span> to see the changes</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>To call a function that takes both positional and variable number of keyword arguments, we can use the following syntax:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise24(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
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
                              <Link to="/exercise23">
                            <button className="back-button">← Back</button>
                          </Link>
                          <div className="footer-description">
    <p>4/5</p>
  </div>
                                {isCorrect && (
                                          <Link to="/exercise25">
                                            <button className="next-button">Next Exercise →</button>
                                          </Link>
                                        )}
                              </div>
          
    </div>
  );
};

export default Exercise;
