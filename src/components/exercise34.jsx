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

           const starterCode = `nums = (2, 12, 5, 8, 9, 3, 16, 7, 13, 19, 21, 
           1, 15, 4, 22, 20, 11)
   
       # Checkpoint 1 code goes here.
   
       # Checkpoint 2 code goes here.`;
   
        
       const handleSubmit = async () => {
        const userData = localStorage.getItem("user"); 
        console.log("🔍 Raw user data from localStorage:", userData);
        const response = await fetch("https://codepy-qio0.onrender.com/validate-solution", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify({ code: userCode, exerciseId: "exercise34" }),
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
                exerciseId: "exercise34",
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
          <h2 className="instructions-title">1.4  Mapping a Filtered Collection</h2>

          <div className="instructions-description">
            <p>In this exercise, we will see how we can combine the <span className="highlight">map()</span> and <span className="highlight">filter()</span> functions. </p>
            <p>Conceptually, if you’re working with a collection of items and find yourself saying, “I need to map only values that have property x,” you will likely need to use <span className="highlight">map()</span> and <span className="highlight">filter()</span> together.</p>
            <p>Let’s take a look at an example.</p>
            <p>We have a tuple representing the records of students in various math classes. The tuple will be structured in the following way: <span className="highlight">student(name, grade, course)</span>. As an example, <span className="highlight">student("Peter", 'B', 101)</span> will represent a student named Peter who received a grade of B in a Math 101 course.</p>
            <p>We want to register students who receive a grade of B or better in their respective math courses for a special advanced math course: Math 201. To create the record for the course, we will filter all students with grade B or higher and map their math course to 201.</p>
            <p>The initial grade in the new tuple will contain the letter ‘X’ to represent that it is not yet defined because the student has not yet finished Math 101. We can do this in Python like so:</p>
            <p>First, we create a <span className="highlight">namedtuple</span> to represent a student:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise34.png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>We then create records for the sample data:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise34(1).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>Finally, we use <span className="highlight">map()</span> to create a new record for a student consisting of:</p>
            <ul>
                <li>their name</li>
                <li>the intial grade X</li>
                <li>the math course Math 201 only IF the student’s previous grade was B or above in their respective math course</li>
            </ul>
            <div className="instructions-image-container">
               <img src="/images/exercise34(2).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <p>The line <span className="highlight">q.grade less than 'B'</span> removes students with grades less than B. The less than appears because the character A is lower than B in the alphabet (how Python compares the characters).</p>
            <p>The code “maps a filtered value”. Remember, that because <span className="highlight">map()</span> returns an iterable, we use the <span className="highlight">tuple()</span> function to generate all the values we need.</p>
            <p>The output will be all the students who are eligible for Math 201:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise34(3).png" alt="Hello World Example" className="instructions-image" />
           </div>
            
            
           <p className="instructions-todo">Instructions</p>
           <p className="instructions-todo-description-question">Copy the starter code below and begin working on it</p>
            <CodeSnippet code={starterCode} />
            <p className="instructions-todo-description-question">1. Given the tuple <span className="highlight">nums</span> multiply values that are greater than 10 by two. Save your result as <span className="highlight">greater_than_10_doubled</span>. Print your answer using the following line of code:</p>
            <div className="instructions-image-container">
               <img src="/images/exercise34(5).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Translate this English sentence into Python: “filter values that are less than 10 and double them.</p>
                <p>You should:</p>
                <ul>
                    <li>use <span className="highlight">filter()</span> to filter out all numbers less than 10</li>
                    <li>use a <span className="highlight">lambda</span> function to double the values</li>
                    <li>use <span className="highlight">map()</span> to connect the <span className="highlight">lambda</span> and <span className="highlight">filter()</span> as we did in the example above</li>
                </ul>
                
              </div>
            )}
          </div>
            <p className="instructions-todo-description-question">2.Convert the following code from the imperative style to the declarative:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise34(6).png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p className="instructions-todo-description">Here, <span className="highlight">nums</span> represents the tuple provided in the workspace.</p>
           <p className="instructions-todo-description">Save your result in a variable called <span className="highlight">functional_way</span>. Print your answer using the following line of code:</p>
           <div className="instructions-image-container">
               <img src="/images/exercise34(7).png" alt="Hello World Example" className="instructions-image" />
           </div>
            <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>The first for loop is “filtering” out values that are not divisible by three. We can rewrite this with a <span className="highlight">filter()</span>.</p>
                <p>The second for loop is “mapping” the data by multiplying the remaining values by three. We can rewrite this with a <span className="highlight">map()</span> and <span className="highlight">lambda</span>.</p>
                <p>Altogether, this imperative code can be written as:</p>
                <div className="instructions-image-container">
               <img src="/images/exercise34(8).png" alt="Hello World Example" className="instructions-image" />
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
                  <Link to="/exercise33">
                <button className="back-button">← Back</button>
              </Link>
              <div className="footer-description">
    <p>4/6</p>
  </div>

                    {isCorrect && (
                              <Link to="/exercise35">
                                <button className="next-button">Next Exercise →</button>
                              </Link>
                            )}
                  </div>
          
    </div>
  );
};

export default Exercise;
