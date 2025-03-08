import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";
import "../styles/dash.css"; // Ensure styles are correctly imported

const exercises = [
    { id: "3.1", exerciseLink:"exercise31", title: "Immutable Data Types", description: "Learn about immutable data types and their importance in functional programming.", difficulty: "Advanced" },
  { id: "3.2", exerciseLink:"exercise32", title: "Lambda Functions", description: "Master Python's lambda functions for concise, anonymous functions.", difficulty: "Advanced" },
  { id: "3.3", exerciseLink:"exercise33", title: "Filter(), map() and reduce()", description: "Learn how to apply higher-order functions to process collections.", difficulty: "Advanced" },
  { id: "3.4", exerciseLink:"exercise34", title: "Mapping a Filtered Collection", description: "Understand how to apply map() after filtering data.", difficulty: "Advanced" },
  { id: "3.5", exerciseLink:"exercise35", title: "Reducing a Mapped Collection", description: "Learn to reduce a mapped collection efficiently.", difficulty: "Advanced" },
  { id: "3.6", exerciseLink:"exercise36", title: "Combining all Three Higher-Order Functions", description: "Integrate filter(), map(), and reduce() for powerful functional programming.", difficulty: "Advanced" },
];


const SyllabusIntermediate = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userEmail = userData?.email || ""; // Get email from localStorage
  console.log("User email:", userEmail)
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    if (!userEmail) {
      console.warn("No user email found, skipping fetch.");
      return;
    }
    // Fetch user progress by email
    const fetchProgress = async () => {


      try {
        console.log("Fetching progress for user:", userEmail);
        
        const response = await axios.get(`https://codepy-qio0.onrender.com/get-progress/${userEmail}`);
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
        if (!userProgress["course3"]) {
          console.warn("Warning: 'course3' key is missing in progress data.");
          console.log("Available keys in progress:", Object.keys(userProgress));
          return;
        }
    
        const course3Exercises = userProgress["course3"]?.completedExercises || [];
        console.log("Completed Exercises for course3:", course3Exercises);
        
        setCompletedExercises(course3Exercises);
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
            <h3 className="syllabus-difficulty">Advanced</h3>
            <h2 className="syllabus-title">Learn Advanced Programming</h2>
            <p className="syllabus-description">
            Learn how to use functional programming to create clean, efficient programs.
            </p>
            <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              
            </div>
            </div>
            <p className="progress-text">{completedExercises.length} / 6 Completed</p>

            {/* Exercises List */}
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
                                 to={isNextExercise ? `/${exercise.exerciseLink}` : "#"} 
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

export default SyllabusIntermediate;
