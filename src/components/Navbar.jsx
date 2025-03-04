import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Draggable from "react-draggable"; // For making the popup draggable

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not authenticated");
      setLoading(false);
      return;
  }
    axios.get("https://codepy-qio0.onrender.com/user-profile", {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then((res) => {
        setUser(res.data);
        setLoading(false); // Data fetched, stop loading
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false); // Stop loading even if error occurs
      });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__logo">
          <Link to="/dash" className="logo-container">
            <img src="codepy_logo(1).PNG" alt="Logo" className="logo" />
            <span className="logo-text">CodePy</span>
          </Link>
        </div>

        {/* AI Chatbot Button */}
        <button className="navbar_card" onClick={() => setShowChatbot(true)}>
          Ask the AI Learning Assistant
        </button>

        <div className="navbar_icons">
         {/* Profile icon with dropdown */}
        <div className="navbar-profile">
          {user && user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="navbar-profile-pic"
            />
          ) : (
            <span className="material-icons">account_circle</span>
          )}

          {/* Dropdown menu */}
          
            <div className="dropdown-menu">
              <Link to="/account" className="dropdown-item">Profile</Link>
              <Link to="/" className="dropdown-item">Log Out</Link>
            </div>
          
        </div>
        </div>
      </nav>

      {/* AI Chatbot Popup Modal */}
      {showChatbot && (
        <div className="modal">
          <Draggable>
            <div className="modal-content">
              <button className="close-button" onClick={() => setShowChatbot(false)}>
                &times;
              </button>
              <iframe
                src="https://codepy-ai.onrender.com/" // Update with your AI chatbot's URL
                width="100%"
                height="500px"
                style={{ border: "none" }}
                title="AI Chatbot"
              ></iframe>
            </div>
          </Draggable>
        </div>
      )}
    </>
  );
};

export default Navbar;
