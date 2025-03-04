import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/account.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    console.log("User Profile Picture URL:", user?.profilePicture);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not authenticated");
      setLoading(false);
      return; // Stop execution if there's no token
  }
    axios.get("https://codepy-qio0.onrender.com/user-profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    <div>
      <nav className="navbar">
        <div className="navbar__logo">
          <Link to="/dash" className="logo-container">
            <img src="codepy_logo(1).PNG" alt="Logo" className="logo" />
            <span className="logo-text">CodePy</span>
          </Link>
        </div>
        <Link to="/ai" className="navbar_card">
          Ask the AI Learning Assistant
        </Link>
        <div className="navbar_icons">
          
          <div className="navbar-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                    {dropdownOpen && (
                      <div className="dropdown-menu">
                        <Link to="/account" className="dropdown-item">Profile</Link>
                        <Link to="/" className="dropdown-item">Log Out</Link>
                      </div>
                    )}
                  </div>
        </div>
      </nav>

      <div className="container">
        <div className="main-content-account">
          <h2 className="account-title">My Profile</h2>

          {loading ? (
            <p>Loading user details...</p>
          ) : user ? (
            <div className="profile-info">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <p>No profile picture available</p>
              )}
              <p><strong>Username:</strong> {user.name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Password:</strong> ******** (hidden for security)</p>
            </div>
          ) : (
            <p>User not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
