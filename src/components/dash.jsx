import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent"
import "../styles/dash.css"; // Ensure your styles are correctly imported

const Dashboard = () => {
  console.log("Dashboard component rendered");
  return (
    <div>
       {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <MainContent />
      
    </div>
  );
};

export default Dashboard;
