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
      'name': 'Jiho',
      'vip_status': False,
      'order': 'Orange Juice, Apple Juice'
    },
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {}
  }
print(tables)
  
def assign_table(table_number, name, vip_status=False): 
    tables[table_number]['name'] = name
    tables[table_number]['vip_status'] = vip_status
    tables[table_number]['order'] = ''
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
        body: JSON.stringify({ code: userCode, exerciseId: "exercise22" }),
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
            exerciseId: "exercise22",
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
          <h2 className="instructions-title">1.2 Working with *args</h2>

          <div className="instructions-description">
            <p>Now that we have seen the basics of working with positional argument unpacking let’s examine how to use it in a more meaningful way.</p>
            <p>Say we wanted to build a function that works similarly to our trusty <span className="highlight">print()</span>  statement but instead prints all of the arguments in uppercase form. Using our knowledge of iteration, combined with the power of the unpacking operator, our solution might look like this:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise22.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Would output:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise22(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>In our function <span className="highlight">shout_strings()</span>, we use a for loop (although we could use any iterator) to iterate through each element of the tuple that exists inside of args. Then we use the built-in function <span className="highlight">.upper()</span> to capitalize each argument.</p>
           <p>The unpacking operator is not limited to being used alone, but rather it can be combined with other positional arguments. Let’s examine a function that truncates (cuts off) sentences based on a provided length:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise22(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Would output:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise22(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p>Let’s break this down:</p>
           <p>1. We have two parameters that our function <span className="highlight">truncate_sentences()</span> defines. The first is a <span className="highlight">length</span> parameter that will specify how many characters we want to keep. The second is a parameter called <span className="highlight">sentences</span> that is paired with the unpacking operator, signifying it will take a variable number of arguments.</p>
           <p>2. On each iteration of the function, we are looping through the tuple created by the <span className="highlight">sentences</span> argument (because it is paired with the unpacking operator) and performing a slice on the sentence based on the provided <span className="highlight">length</span> argument. This forces every value in the <span className="highlight">sentences</span> tuple to be cut down in length.</p>
           <p>Utilizing iteration and other positional arguments are two common ways we can increase the utility of our functions when using the unpacking operator (*). Let’s practice using these techniques to see how powerful they are!</p>
           
            <p className="instructions-todo">Instructions</p>
            return <CodeSnippet code={starterCode} />;
            <p className="instructions-todo-description-question">1. Jiho is having a lot of success with our restaurant application. Unfortunately, our original design did not account for storing orders for each specific table. Jiho asked us to adjust our application to be able to store the orders that come in for each specific table and also be able to print out the order for the kitchen staff.</p>
            <p className="instructions-todo-description">   Take some time to review the adjusted structure of the program we created earlier. Note that <span className="highlight">tables</span> is now dictionary with the table numbers as the keys. It also accounts for a new property called <span className="highlight">order</span>. The <span className="highlight">assign_table</span> function has also been adjusted to account for the changes.</p>
            <p className="instructions-todo-description">   Run the code to have an idea on how it works</p>
            <p className="instructions-todo-description-question">2. To help Jiho implement the ability to store the order in a specific table, let’s define a function called <span className="highlight">assign_and_print_order()</span>.</p>
            <p className="instructions-todo-description">   The function should have two parameters called <span className="highlight">table_number</span> and <span className="highlight">order_items</span>. The parameter of order_items should be grouped with an unpacking operator (*) so we can capture a variable number of order items per table.</p>
            <p className="instructions-todo-description">   For now, our program will error out if we run it. Don’t worry we will fill in the function in the next step!</p>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>A positional argument must always precede a variable argument:</p>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">3. Our function <span className="highlight">assign_and_print_order()</span> should then assign an order to a table. Inside of our function, access the nested <span className="highlight">order</span> key for the specific table (using the <span className="highlight">table_number</span> argument) from <span className="highlight">tables</span> and set it to the <span className="highlight">order_items()</span> parameter.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Refer to <span className="highlight">assign_table</span>for an example syntax of accessing nested keys.</p>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">4. In addition to assigning the order to our <span className="highlight">tables</span> dictionary, we also want to print every ordered item so the kitchen knows what to cook!</p>
          <p className="instructions-todo-description">Inside of <span className="highlight">assign_and_print_order()</span> use a for loop to iterate through <span className="highlight">order_items</span> and print each individual order item.</p>
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className={`hint-content ${showHint ? "hint-visible" : ""}`}>
                <p>Here is an example of a for loop in Python:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise22(4).png" alt="Hello World Example" className="instructions-image" />
           </div>
              </div>
            )}
          </div>
          <p className="instructions-todo-description-question">5. Lastly, let’s see our function in action. Luckily we just had a new customer come in for their reservation. Use the <span className="highlight">assign_table</span> function to add a new customer named <span className="highlight">'Arwa'</span>' to table 2 with a VIP status set to <span className="highlight">True</span>.</p>
          <p className="instructions-todo-description-question">6. Now that Arwa is seated and ready to order, call our <span className="highlight">assign_and_print_order()</span> function for table 2 with the order items of <span className="highlight">'Steak'</span>, <span className="highlight">'Seabass'</span>, and <span className="highlight">'Wine Bottle'</span>.</p>
          <p className="instructions-todo-description">Print <span className="highlight">tables</span> to see the result</p>
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
                        <Link to="/exercise21">
                      <button className="back-button">← Back</button>
                    </Link>
                    <div className="footer-description">
    <p>2/5</p>
  </div>
                          {isCorrect && (
                                    <Link to="/exercise23">
                                      <button className="next-button">Next Exercise →</button>
                                    </Link>
                                  )}
                        </div>
          
    </div>
  );
};

export default Exercise;
