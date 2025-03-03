import React, { useState } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation

const Login = () => {

  
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/login', {email, password})
    .then(result => {
    console.log(result)
    if(result.data === "Success") {
        navigate('/home')
    }
    
  })
    .catch(err=>console.log(err))

  }
  
  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Username */}

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
             type="email" 
             name="email" 
             className="form-control"
             onChange={(e) => setEmail(e.target.value)}
              />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
          type="password" 
          name="password" 
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
           />
        </div>

        {/* Profile Picture Upload */}
       

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      {/* Already have an account? */}
      <div className="mt-3">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Login;
