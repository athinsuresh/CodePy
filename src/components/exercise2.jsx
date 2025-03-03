import React, { useState} from "react";
import Navbar from "./Navbar";
import "../styles/exercise.css";
import CodeEditor from "./CodeEditor";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

const Exercise = () => {
  const [showHint, setShowHint] = useState(false);
   // For navigating to the next exercise
   const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));

  const handleNextExercise = async () => {
    if (!user) return;

    try {
      await axios.post("http://localhost:3001/update-progress", {
        email: user.email,
        course: "course1",
        exerciseId: "exercise2",
      });
      console.log("Progress updated");

      // Navigate to the next exercise
      navigate("/exercise2");
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
   
  return (
    <div className="exercise-page">
      <Navbar />

      {/* Main Content */}
      <div className="exercise-container">
        {/* Left Side: Instructions */}
        <div className="instructions-container">
          <h2 className="instructions-title">1.2  Print Statements</h2>

          <div className="instructions-description">
            <p>There are two different Python versions. Both Python 2 and Python 3 are used throughout the globe. The most significant difference between the two is how you write a print statement. In Python 3, print has parentheses.</p>
            <p>In this course we will be using Python 2. If you go on to write Python 3 it will be useful to note this key difference.</p>
            <div className="instructions-image-container">
               <img src="/images/exercise11.png" alt="Hello World Example" className="instructions-image" />
           </div>
           <p className="instructions-todo">Instructions</p>
            <p className="instructions-todo-description-question">1. Print something using Python 3’s syntax.</p>
          </div>

          {/* Hint Section */}
          <div className="instructions-hint">
            <button className="hint-button" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>Hint: Remember to include parentheses!</p>
              </div>
            )}
          </div>
          
        </div>

        {/* Right Side: Code Editor */}
        
          <CodeEditor />
        
      </div>

      {/* Next Exercise Button */}
      <div className="exercise-footer">
      <Link to="/exercise1">
    <button className="back-button">← Back</button>
  </Link>
  <div className="footer-description">
    <p>2/11</p>
  </div>
        
                  <Link to="/exercise3">
                    <button className="next-button" onClick={handleNextExercise}>Next Exercise →</button>
                  </Link>
                
      </div>
          
    </div>
  );
};

export default Exercise;
