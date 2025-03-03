import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/dash.css"; // Ensure styles are correctly imported


const exercises = [
  { id: "1.1", exerciseLink:"exercise1", title: "Hello World", description: "Write your first Python program and print 'Hello, World!'." },
  { id: "1.2", exerciseLink:"exercise2",title: "Print Statements", description: "Learn how to use the print function to display text output." },
  { id: "1.3", exerciseLink:"exercise3",title: "Strings", description: "Understand string operations and manipulation in Python." },
  { id: "1.4", exerciseLink:"exercise4",title: "Handling Errors", description: "Learn how to debug and handle errors in Python scripts." },
  { id: "1.5", exerciseLink:"exercise5",title: "Variables", description: "Understand how to declare and use variables in Python." },
  { id: "1.6", exerciseLink:"exercise6",title: "Arithmetic", description: "Perform arithmetic operations such as addition, subtraction, and multiplication." },
  { id: "1.7", exerciseLink:"exercise7",title: "Comments", description: "Learn how to write comments in Python for better code readability." },
  { id: "1.8", exerciseLink:"exercise8",title: "Two Types of Division", description: "Explore integer division and floating-point division in Python." },
  { id: "1.9", exerciseLink:"exercise9",title: "Boolean", description: "Understand boolean values and logical operations in Python." },
  { id: "1.10", exerciseLink:"exercise10",title: "Value Error", description: "Learn about ValueErrors and how to handle them." },
  { id: "1.11", exerciseLink:"exercise11",title: "Final Review and Quiz Time", description: "You've learned enough now. Time to put them to use!" },
];

const SyllabusBeginner = ({userEmail}) => {
  console.log("User email:", userEmail)
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    // Fetch user progress by email
    const fetchProgress = async () => {

      try {
        console.log("Fetching progress for user:", userEmail);
        
        const response = await axios.get(`http://localhost:3001/get-progress/${userEmail}`);
        console.log("Full API Response:", response.data);
    
        if (!response.data) {
          console.warn("Warning: Response data is undefined or null.");
          return;
        }
    
        if (!response.data.progress) {
          console.warn("Warning: 'progress' property is missing in response data.");
          console.log("Received data:", response.data);
          return;
        }
    
        const userProgress = response.data.progress;
        console.log("User progress object:", userProgress);
    
        // Debugging if course1 exists
        if (!userProgress["course1"]) {
          console.warn("Warning: 'course1' key is missing in progress data.");
          console.log("Available keys in progress:", Object.keys(userProgress));
          return;
        }
    
        const course1Exercises = userProgress["course1"]?.completedExercises || [];
        console.log("Completed Exercises for course1:", course1Exercises);
        
        setCompletedExercises(course1Exercises);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    

    fetchProgress();
  }, [userEmail]); // Re-fetch when userEmail changes

  const progressPercentage = (completedExercises.length / exercises.length) * 100;

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="main-container">
        <div className="syllabus-card">
          {/* Left Section - Course Details */}
          <div className="syllabus-details">
            <h3 className="syllabus-difficulty">Beginner</h3>
            <h2 className="syllabus-title">Introduction to Python</h2>
            <p className="syllabus-description">
              Learn the basics of Python 3.12, one of the most powerful, versatile, and in-demand programming languages today.
            </p>
            {/* Progress Bar */}
            <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              
            </div>
            </div>
            <p className="progress-text">{completedExercises.length} / 11 Completed</p>

            {/* Exercises List */}
            <div className="syllabus-exercise-list">
  {exercises.map((exercise, index) => {
    console.log("Completed Exercises Array:", completedExercises);
    const isCompleted = completedExercises.includes(exercise.exerciseLink);
    const isNextExercise = !isCompleted && index === completedExercises.length;
    console.log(`Exercise ID: ${exercise.id}`);
    console.log(`Completed Exercises:`, completedExercises);
    console.log(`Is Completed: ${isCompleted}`);
    console.log(`Is Next Exercise: ${isNextExercise}`);
    return (
      <div key={exercise.id} className="syllabus-exercise-item">
        <div className="syllabus-exercise-info">
          <h4>{exercise.id} {exercise.title}</h4>
          <p>{exercise.description}</p>
        </div>
        <Link 
          to={isNextExercise ? `/exercise${index + 1}` : "#"} 
          className={`syllabus-start-button ${isCompleted ? "completed" : isNextExercise ? "active" : "locked"}`}
        >
          {isCompleted ? "Completed ✔" : isNextExercise ? "Start →" : "Locked 🔒"}
        </Link>
      </div>
    );
  })}
</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusBeginner;
