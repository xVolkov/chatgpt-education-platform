import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTeacher = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [universityError, setUniversityError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const universitiesInCanada = [
    'Ontario Tech University',
    'Toronto Metropolitan University',
    'Macmaster University',
    'University of Waterloo',
    // Add more universities as needed
  ];

  function validateForm() {
    let isValid = true;

    if (!firstName) {
      setFirstNameError('Please enter your first name');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError('Please enter your last name');
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (!university) {
      setUniversityError('Please select your university');
      isValid = false;
    } else {
      setUniversityError('');
    }

    if (!email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter a password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match!');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  }

  function isValidEmail(email) {
    // Add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()==true) {
      // Registration logic here if all fields are valid
      //const isRegistrationSuccessful = true; // Replace with actual registration check
      navigate('/register-confirmation'); // Redirect to confirmation page

    } else {
      // Show an alert or handle errors
      alert('Please fill out all fields correctly');
    }
  }

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
        <span className="error-message">{firstNameError}</span>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <span className="error-message">{lastNameError}</span>
        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
        >
          <option value="">Select University</option>
          {universitiesInCanada.map((universityName, index) => (
            <option key={index} value={universityName}>
              {universityName}
            </option>
          ))}
        </select>
        <span className="error-message">{universityError}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your University Email"
          required
        />
        <span className="error-message">{emailError}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <span className="error-message">{passwordError}</span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <span className="error-message">{confirmPasswordError}</span>
        <button type="submit" className="register-button">
          Register An Account
        </button>
      </form>
    </div>
  );
};

export default RegisterTeacher;