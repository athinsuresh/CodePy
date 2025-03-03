import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
        
        <div className="navbar__logo">
  <Link to="/" className="logo-container"> {/* Apply the container class */}
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
  );
};

export default Navbar;
