import React from "react";

const Chatbot = () => {
  return (
    <div style={{ width: "100%", height: "90vh", padding: "20px" }}>
      <iframe
        src="http://localhost:5174" // Change to the AI chatbot URL
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="AI Chatbot"
      ></iframe>
    </div>
  );
};

export default Chatbot;
