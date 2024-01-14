import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTeacher = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  function handleSubmit(event) {
    event.preventDefault();
    // Implement your registration logic here.
    // For example, send the user details to your backend, handle the response, etc.
    // This is just a placeholder for demonstration.
    const isRegistrationSuccessful = true; // Replace with actual registration check

    if (isRegistrationSuccessful) {
      navigate('/registration-confirmation'); // Redirect to confirmation page
    } else {
      // Handle registration failure (e.g., show an error message)
      alert('Error 2: Registration failed');
    }
  };

  const navigateToConfirmation = () => {
    navigate('/registeration-confirmation'); // Navigate to the RegisterTeacher component
  };

  return (
    <div className="register-container">
      <h1>Register as Teacher</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="University"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your University Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" className="register-button" onClick={navigateToConfirmation}>Register An Account</button>
      </form>
    </div>
  );
};

export default RegisterTeacher;