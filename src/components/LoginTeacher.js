import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function isValidEmail(email) {
  // Define a regular expression pattern for email validation.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

const LoginTeacher = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  function handleSubmit(event) {
    event.preventDefault();
    const inputEmail = event.target.email.value;

    if (isValidEmail(inputEmail)) {
      // Email is valid, proceed with form submission.
      // Implement your login logic here. For example, you might want to send
      // the email and password to your backend for verification and get a token in response.
      // This is just a placeholder for demonstration.
      const isLoginSuccessful = true; // Replace with actual login check

      if (isLoginSuccessful) {
        navigate('/home'); // Navigate to the Home component on success
      } else {
        // Handle login failure (e.g., show an error message)
        alert('Error 1: Login failed');
      }
    } else {
      // Display an error message for invalid email.
      // You can add your error handling logic here.
      alert('Please enter a valid email address.');
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
    <div className="login-container">
      <h1>Login as Teacher</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email" // Added name attribute to the input
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
  );
};

export default LoginTeacher;