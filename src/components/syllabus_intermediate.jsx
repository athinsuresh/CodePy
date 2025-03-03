import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/dash.css"; // Ensure styles are correctly imported

const exercises = [
    { id: "2.1", exerciseLink:"exercise21", title: "Variable number of arguments: *args", description: "Learn how to use *args for handling variable numbers of arguments.", difficulty: "Intermediate" },
    { id: "2.2", exerciseLink:"exercise22", title: "Working with *args", description: "Practice using *args in different function scenarios.", difficulty: "Intermediate" },
    { id: "2.3", exerciseLink:"exercise23", title: "Variable number of arguments: **kwargs", description: "Understand how **kwargs helps in handling keyword arguments.", difficulty: "Intermediate" },
    { id: "2.4", exerciseLink:"exercise24", title: "Working with **kwargs", description: "Practice using **kwargs for more flexible function calls.", difficulty: "Intermediate" },
    { id: "2.5", exerciseLink:"exercise25", title: "All together now!", description: "Combine *args and **kwargs to write powerful Python functions.", difficulty: "Intermediate" },
];

const SyllabusIntermediate = ({userEmail}) => {
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
        if (!userProgress["course2"]) {
          console.warn("Warning: 'course2' key is missing in progress data.");
          console.log("Available keys in progress:", Object.keys(userProgress));
          return;
        }
    
        const course2Exercises = userProgress["course2"]?.completedExercises || [];
        console.log("Completed Exercises for course2:", course2Exercises);
        
        setCompletedExercises(course2Exercises);
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
            <h3 className="syllabus-difficulty">Intermediate</h3>
            <h2 className="syllabus-title">Function Arguments</h2>
            <p className="syllabus-description">
            Master Python's flexible function arguments with *args and **kwargs for dynamic and efficient coding!
            </p>
            <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              
            </div>
            </div>
            <p className="progress-text">{completedExercises.length} / 5 Completed</p>


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
