import React from "react";
import { useState } from "react";
import axios from 'axios'
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginPage = ({setUser}) => {
    const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://codepy-qio0.onrender.com";


    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      console.log("User data from login response:", response.data.user); // Debugging

      if (response.data.message === "Success") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token)
        setUser(response.data.user)
        navigate("/dash"); // Redirect on success
      } else {
        setError(response.data); // Display error message
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  };

    return (
        <div>
            {/* Wrapper div for the title and login form */}
            <div className="login-container">
                <div className="title-container">
                    <h1 className="app-title">CodePy</h1>
                    <p className="app-description">Code smarter, not harder— AI-powered learning made just for you!🚀</p>
                </div>

              <form onSubmit={handleSubmit}>

                <div className="LoginCard">
                    
                    <div className="navbar__logo">
                        <div className="logo-container">
                            <img src="codepy_logo(1).PNG" alt="Logo" className="logo" />
                            <span className="login-text">Login to CodePy</span>
                        </div>
                    </div>
                    <input
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="primaryInput focus"
                        placeholder="E-Mail"
                    />
                    <input
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="primaryInput focus"
                        placeholder="Password"
                    />
                    {error && <p className="error-message">{error}</p>}
                    
                    
                    <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {loading && <p className="loading-text">Processing your request... 🔄</p>}
          {loading && <p className="loading-text">🚀 Waking up the server... This may take up to 50 seconds.</p>}

                    
                </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
