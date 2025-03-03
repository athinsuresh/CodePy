import React from "react";
import { Link } from "react-router-dom";



const MainContent = () => {
  return (
    <div className="main-content">
  <div className="card-container">
    {/* Card 1 */}
    <div className="card">
        <h3 className="card-difficulty"> Nigger </h3>
      <h3 className="card-title">Introduction to Python</h3>
      <p className="card-description">
        Practice coding exercises to reinforce your learning.
      </p>
      <div className="exercise-list">
  <ul>
    <li>1.1 Hello World</li>
    <li>1.2 Print Statements</li>
    <li>1.3 Strings</li>
    <li>1.4 Handling Errors</li>
    <li>1.5 Variables</li>
    <li>1.6 Arithmetic</li>
    <li>1.7 Comments</li>
    <li>1.8 Two Types of Division</li>
    <li>1.9 Boolean</li>
    <li>1.10 Value Error</li>

  </ul>
</div>
      
      {/* Card Footer */}
      <div className="card-footer">
        <Link to="/syllabus" className="footer-link">View Syllabus</Link>
        <Link to="/exercise" className="footer-button">Resume →</Link>
      </div>
    </div>
  </div>
</div>

  );
};

export default MainContent;