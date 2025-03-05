import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MainContent = () => {
  const cardData = [
    {
      courseID: "course1",
      difficulty: "Beginner",
      title: "Introduction to Python",
      description:
        "Learn the basics of Python 3.12, one of the most powerful, versatile, and in-demand programming languages today.",
      exercises: [
        "1.1 Hello World",
        "1.2 Print Statements",
        "1.3 Strings",
        "1.4 Handling Errors",
        "1.5 Variables",
        "1.6 Arithmetic",
        "1.7 Comments",
        "1.8 Two Types of Division",
        "1.9 Boolean",
        "1.10 Value Error",
        "1.11 Final Review and Quiz Time!",
      ],
      syllabus: "/syllabus-beginner",
      link: "/exercise",
      image: "/images/hard.jpg",
      requiredProficiency: "Beginner",
    },
    {
      courseID: "course2",
      difficulty: "Intermediate",
      title: "Function Arguments",
      description:
        "Master Python's flexible function arguments with *args and **kwargs for dynamic and efficient coding!",
      exercises: [
        "1.1 Variable number of arguments: *args",
        "1.2 Working with *args",
        "1.3 Variable number of arguments: **kwargs",
        "1.4 Working with **kwargs",
        "1.5 All together now!",
      ],
      syllabus: "/syllabus-intermediate",
      link: "/exercise21",
      image: "/images/intemediate.jpg",
      requiredProficiency: "Intermediate",
    },
    {
      courseID: "course3",
      difficulty: "Advanced",
      title: "Learn Advanced Programming",
      description:
        "Learn how to use functional programming to create clean, efficient programs.",
      exercises: [
        "1.1 Immutable Data Types",
        "1.2 Lambda Functions",
        "1.3 Filter(), map() and reduce()",
        "1.4 Mapping a Filtered Collection",
        "1.5 Reducing a Mapped Collection",
        "1.6 Combining all Three Higher-Order Functions",
      ],
      syllabus: "/syllabus-advanced",
      link: "/exercise31",
      image: "/images/beginner.jpg",
      requiredProficiency: "Advanced",
    },
  ];

  const [openPopups, setOpenPopups] = useState({});
  const [user, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userProficiency, setUserProficiency] = useState("");
  const [progress, setProgress] = useState({});
  const getResumeLink = (course) => {
    const completedExercises = progress[course.courseID] || 0;

    let baseNumber;
    if (course.courseID === "course1") baseNumber = 1;
    else if (course.courseID === "course2") baseNumber = 21;
    else if (course.courseID === "course3") baseNumber = 31;
    else baseNumber = 1; // Default fallback

    let buttonLabel;
    let exerciseLink;
    let buttonClass;

    if (completedExercises === 0) {
      buttonLabel = "Start";
      exerciseLink = `/exercise${baseNumber}`;
      buttonClass = "start-button";
    } else if (completedExercises >= course.exercises.length) {
      buttonLabel = "Completed";
      exerciseLink = course.link; // Redirect to final page
      buttonClass = "completed-button";
    } else {
      buttonLabel = "Resume";
      exerciseLink = `/exercise${baseNumber + completedExercises}`;
      buttonClass = "resume-button";
    }

    return { exerciseLink, buttonLabel, buttonClass };
  };
  

  // Fetch user details
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name && userData.email) {
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserProficiency(userData.proficiency);
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    console.log("User Proficiency:", userProficiency);
  }, [userProficiency]);

  // Fetch user progress dynamically
  useEffect(() => {
    if (!userEmail) return;

    const fetchProgress = async (courseID) => {
      try {
        const response = await axios.get(
          `https://codepy-qio0.onrender.com/get-progress/${userEmail}`
        );
        const userProgress = response.data?.progress || {};
        const completedExercises =
          userProgress[courseID]?.completedExercises || [];
        setProgress((prev) => ({
          ...prev,
          [courseID]: completedExercises.length,
        }));
      } catch (error) {
        console.error(`Error fetching progress for ${courseID}:`, error);
      }
    };

    cardData.forEach((course) => fetchProgress(course.courseID));
  }, [userEmail]);

  const togglePopup = (index) => {
    setOpenPopups((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="main-container">
      <div className="main-content-title">
        <h1>
          Hi, {user} <span className="wave-emoji">👋</span>
        </h1>
        <p className="main-content-description">Welcome to your dashboard!</p>
      </div>
      <div className="main-content">
        <div className="card-container">
          {cardData.map((card, index) => {
            const { exerciseLink, buttonLabel, buttonClass } = getResumeLink(card);
            const completedExercises = progress[card.courseID] || 0;
            const totalExercises = card.exercises.length;
            const progressPercentage = (completedExercises / totalExercises) * 100;
            const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const userLevelIndex = difficultyLevels.indexOf(userProficiency);
  const courseLevelIndex = difficultyLevels.indexOf(card.requiredProficiency);
  const prevCourseID = cardData[courseLevelIndex - 1]?.courseID;
const prevCourseCompleted = prevCourseID ? (progress[prevCourseID] || 0) >= (cardData[courseLevelIndex - 1]?.exercises.length || 0) : true;
  const isLocked = courseLevelIndex > userLevelIndex && !prevCourseCompleted; // If course level is higher, lock it
            return (
              <div
                className="card"
                key={index}
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  opacity: isLocked ? 0.6 : 1, // Reduce opacity if locked
        pointerEvents: isLocked ? "none" : "auto", // Prevent interaction
        position: "relative",
                }}
              >
                {isLocked && (
        <div className="locked-overlay">
          <p className="locked-text">🔒 Locked</p>
        </div>
      )}
                <h3 className="card-difficulty"> {card.difficulty} </h3>
                <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              
            </div>
            </div>
                <h3 className="card-title"> {card.title} </h3>
                <p className="card-description">{card.description}</p>
                <div className="exercise-list">
                  <ul>
                    {card.exercises.map((exercise, i) => (
                      <li key={i}>{exercise}</li>
                    ))}
                  </ul>
                </div>

                {/* Locked Overlay */}
     

                {/* Progress Bar */}
        

                {/* Card Footer */}
                <div className="card-footer">
                  <Link to={card.syllabus} className="footer-link">
                    View Syllabus
                  </Link>
                  <Link to={exerciseLink} className={`footer-button ${buttonClass}`}>
                {buttonLabel}
              </Link>
                  
                </div>

                {/* Pop-up Syllabus */}
                {openPopups[index] && (
                  <div className="popup-card">
                    <h2 className="popup-title">Syllabus</h2>
                    <p className="popup-content">{card.syllabus}</p>
                    <button
                      onClick={() => togglePopup(index)}
                      className="popup-close"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
