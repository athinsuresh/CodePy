import React from "react";
import { Link } from "react-router-dom"; // For navigation
import MainContent from "./MainContent"; 

const Sidebar = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <ul className="sidebar__menu">
          <li>
            <span className="material-icons">space_dashboard</span>
            <Link to="/">Dashboard</Link> {/* Link to Dashboard */}
          </li>
          <li>
            <span className="material-icons">school</span>
            My Learning
          </li>
          <li>
            <span className="material-icons">workspaces</span>
            Workspace
          </li>
        </ul>
      </div>
      <MainContent />
    </div>
  );
};

export default Sidebar;
