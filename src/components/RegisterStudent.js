import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import '../styles.css'; // Import the CSS file

const RegisterStudent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Error checking:
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [universityError, setUniversityError] = useState('');
  const [studentNumberError, setStudentNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverResponse, setServerResponse] = useState(''); // Displays python flask server response
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
    } else {setFirstNameError('');}

    if (!lastName) {
      setLastNameError('Please enter your last name');
      isValid = false;
    } else {setLastNameError('');}

    if (!university) {
      setUniversityError('Please select your university');
      isValid = false;
    } else {setUniversityError('');}

    if (!studentNumber){
      setStudentNumberError("Please enter your student number");
      isValid = false;
    } else {setStudentNumberError('');}

    if (!email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {setEmailError('');}

    if (!password) {
      setPasswordError('Please enter a password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    } else {setPasswordError('');}

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match!');
      isValid = false;
    } else {setConfirmPasswordError('');}

    return isValid;
  }

  function isValidEmail(email) {
    // Add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    const userType = "Student" // Set user type as teacher for the about to be registered user

    if (validateForm()) {
        const userData = {
            firstName,
            lastName,
            university,
            studentNumber,
            email,
            password,
            userType,
          };
          //alert(JSON.stringify(userData)); // <<<DEBUG>>> Displays user data before sending them to flask server

        try{ // Contacting the flask server and sending the user data
            const response = await fetch('http://localhost:5000/register', {
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
            navigate('/register-confirmation'); // Redirect user to RegisterConfirmation page
          } else {
            // Handle HTTP errors
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);
            setServerResponse(jsonResponse.message);
            //alert('Registration failed. Please try again.');
            console.error('Failed to register.');
            }
        } catch (error) {
            // Handle network errors
            setServerResponse('An error occurred during registration.');
            //alert('An error occurred during registration.');
            console.error('Network error:', error);
        }
    } else {
        setServerResponse('Please fill out all fields correctly');
        //alert('Please fill out all fields correctly');
    };
    }

  return ( 
    
    <div>
      <div className="header">
        <img src={logo} alt="logo" className="LogoIcon" />
        <h1>SmartLearnAI</h1>
      </div>
      <div className="register-container">
        <h1>Register as Student</h1>
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
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            placeholder="Student Number"
            required
          />
          <span className="error-message">{studentNumberError}</span>

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
      <div className="server-response">
        {serverResponse && <p>{serverResponse}</p>}
      </div>
    </div>
  );
};

export default RegisterStudent;