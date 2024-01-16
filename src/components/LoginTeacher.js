import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import '../styles.css'; // Import the CSS file

function isValidEmail(email) {
  // Define a regular expression pattern for email validation.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

const LoginTeacher = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverResponse, setServerResponse] = useState(''); // Displays python flask server response
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async(event) => {
    event.preventDefault();
    const userType = "Teacher" // Set user type as "teacher" to allow access to teacher portal
    const inputEmail = event.target.email.value;

    if (isValidEmail(inputEmail)) {

        const userData = {
            email,
            password,
            userType,
          };

        try{ // Contacting the flask server and sending the user data
            const response = await fetch('http://localhost:5000/login-teacher', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            // Handle successful registration
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);
            setServerResponse(jsonResponse.message);
            navigate('/home-teacher'); // Redirect user to RegisterConfirmation page
          } else {
            // Handle HTTP errors
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);
            setServerResponse(jsonResponse.message);
            //alert('Registration failed. Please try again.');
            console.error('Failed to login.');
            }
        } catch (error) {
            // Handle network errors
            setServerResponse('An error occurred during login.');
            //alert('An error occurred during registration.');
            console.error('Network error:', error);
        }
    } else {
        setServerResponse('Please fill out all fields correctly');
        //alert('Please fill out all fields correctly');
    }
};

  // Function to handle navigation to the Register page
  const navigateToRegister = () => {
    navigate('/register-teacher'); // Navigate to the RegisterTeacher component
  };

  // Function to handle navigation to forgot password page
  const navigateToForgotPass = () => {
    navigate('/forgot-password');
  }
  
  return (
    <div>
      <div className="header">
        <img src={logo} alt="logo" className="LogoIcon" />
        <h1>SmartLearnAI</h1>
      </div>
        <div className="server-response">
        {serverResponse && <p>{serverResponse}</p>}
        </div>
      <div className="login-container">
        <h1>Login as Teacher</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            title="Please enter a valid email address"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit" className="login-button">Login</button>
          <button type="button" className="forgot-password-button" onClick={navigateToForgotPass}>Forgot Password?</button>
          <button type="button" className="register-button" onClick={navigateToRegister}>Register An Account</button>
        </form>
      </div>
    </div>
  );
};

export default LoginTeacher;