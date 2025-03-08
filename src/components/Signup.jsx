import React from "react";
import { useState } from "react";
import axios from 'axios'

import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const SignUpPage = () => {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [profilePicture, setProfilePicture]= useState()
  const [proficiency, setProficiency]= useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState ({});
  const navigate = useNavigate()

  const validateForm = () => {
    let newErrors = {};

    if (!name) newErrors.name = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";

    if (!profilePicture) newErrors.profilePicture = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
        setLoading(false)
        return;} 

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);
    formData.append("proficiency", proficiency);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "https://codepy-qio0.onrender.com";
    console.log("API_BASE_URL:", API_BASE_URL);  // ✅ Debug API base URL
console.log("Final API URL:", `${API_BASE_URL}/register`);  // ✅ Debug final request URL

    try {
        const result = await axios.post(`${API_BASE_URL}/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Registration Response:", result);

        const { user, token } = result.data;

        if (user && token) {
            // Store user and token in local storage
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            // Redirect to dashboard
            navigate("/dash");
        } else {
            console.error("User registration failed: No token received.");
        }
    } catch (err) {
        console.error("Registration error:", err);
    } finally {
        setLoading(false);
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
                            <span className="login-text">SignUp to CodePy</span>
                        </div>
                    </div>
                    <input
                      name="username" 
                      className="primaryInput focus"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Username"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                    <input
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="primaryInput focus"
                        placeholder="E-Mail"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                    <input
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="primaryInput focus"
                        placeholder="Password"
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    <select
  name="proficiency"
  className="primaryInput focus"
  value={proficiency}
  onChange={(e) => setProficiency(e.target.value)}
>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>

                    <input
                        name="profilePicture"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                        type="file"
                        className="primaryInput focus"
                        placeholder="Choose a file"
                    />
                    {errors.profilePicture && <p className="error-message">{errors.profilePicture}</p>}

                    <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {loading && <p className="loading-text">Processing your request... 🔄</p>}
          {loading && <p className="loading-text">🚀 Waking up the server... This may take up to 50 seconds.</p>}

                    <small className="forgot_password">Already have an account?</small>
                    
                     <p className="login-button"><Link to="/login">Login</Link></p>
                </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
