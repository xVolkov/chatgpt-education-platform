import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  function validateForm() {
    let isValid = true;

    if (!email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  }

  function isValidEmail(email) {
    // Add your email validation logic here
    // For a simple check, you can use a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to handle navigation after email confirmation is done
  // This could navigate to a login page or a dashboard, depending on your app's flow
  function handleContinue(event) {
    event.preventDefault();
    if (validateForm()==true) {
        // Registration logic here if all fields are valid
        //const isRegistrationSuccessful = true; // Replace with actual registration check
        alert('Password recovery email has been sent, please follow its instructions.');
        navigate('/'); // redirects users to login-register page
      } else {
        // Show an alert or handle errors
        alert('Please fill out all fields correctly');
      } 
  }

  return (
    <div className="password-recovery">
      <h1>Password Recovery</h1>
      <p>
        Please fillout your email address and you will receive a password recovery email with instructions.
      </p>
      <input
          type="email"
          name="email" // Added name attribute to the input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          title="Please enter a valid email address"
        />
        <span className="error-message">{emailError}</span>
      <button onClick={handleContinue}>Submit</button>
    </div>
  );
};

export default ForgotPassword;