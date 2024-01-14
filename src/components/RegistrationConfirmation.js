import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationConfirmation = () => {
  const navigate = useNavigate();

  // Function to handle navigation after email confirmation is done
  // This could navigate to a login page or a dashboard, depending on your app's flow
  function handleContinue() {
    navigate('/login-teacher'); // Example: Redirect to the login page
  }

  return (
    <div className="confirmation-container">
      <h1>Registration Successful!</h1>
      <p>
        A confirmation email has been sent to your provided University Email.
        Please confirm your email by clicking on the link provided in the
        confirmation email before proceeding further on the site.
      </p>
      <button onClick={handleContinue}>Go to Login</button>
    </div>
  );
};

export default RegistrationConfirmation;
