import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/account.css"; // Import CSS

const Account = () => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details (Replace this with actual authentication logic)
    axios.get("http://localhost:3001/user-profile")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);
  

  

  return (
    <div>
      <nav className="navbar">
              
              <div className="navbar__logo">
        <Link to="/dash" className="logo-container"> {/* Apply the container class */}
          <img src="codepy_logo(1).PNG" alt="Logo" className="logo" />
          <span className="logo-text">CodePy</span> {/* Use a span for styling */}
        </Link>
      </div>
            <Link to="/ai" className="navbar_card">
              Ask the AI Learning Assistant
            </Link>
            <div className="navbar_icons">
              <span className="material-icons">notifications</span>
              <span className="material-icons">settings</span>
              <Link to="/account">
                <span className="material-icons">account_circle</span>
              </Link>
            </div>
          </nav>

      <div className="container">
        

        <div className="main-content-account">
          <h2>Fill in your credentials</h2>
          <div className="profile-info">
              <img
                src={`http://localhost:3001/uploads/${user.profilePicture}`}
                alt="Profile"
                className="profile-pic"
              />
              <p><strong>Username:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Password:</strong> ******** (hidden for security)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Account;