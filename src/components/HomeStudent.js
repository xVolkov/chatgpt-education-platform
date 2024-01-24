import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../App.css';  // Import App-specific styles
import '../Home.css';  // Import the newly created styles file
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

function Rectangle({ children, buttonArray }) {

  const navigate = useNavigate();

  return (
    <div className="RectangleStudent">
      {children}
      <div className="RectangleButtonContainerStudent">
        {buttonArray.map((buttonText, index) => (
          <button key={index} className="RectangleButtonStudent">{buttonText}</button>
        ))}
      </div>
    </div>
  );
}

function App() {

  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const navigate = useNavigate();
  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  return (
    <div className="App">
      <header className="AppHeader">
        <div className="AppHeaderLeft">
          <img src={logo} alt="logo" className="LogoIcon" />
          <p>SmartLearnAI</p>
        </div>
        <div className="AppHeaderRight">
          <img src={profile} alt="profile" className="ProfileIcon" />
          <p className="HiTeacherText">Hi Student1!</p>
          <img 
            src={settings} 
            alt="settings" 
            className="SettingIcon" 
            onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleSignOut}>Sign out</button>
            </div>
          )}
        </div>
      </header>

      <header className="SecondHeader">
        <img src={home} alt="home" className="HomeIcon" />
        <p>Dashboard</p>
        <p>Add Courses</p>
        <p>Contact Support</p>
      </header>

      <Rectangle buttonArray={["LiveTA", "Chats Feedback"]}>
      <p>Cloud Computing</p>
      </Rectangle>

      <Rectangle buttonArray={["LiveTA", "Chats Feedback"]}>
      <p>Modelling and Simulations</p>
      </Rectangle>

      <Rectangle buttonArray={["LiveTA", "Chats Feedback"]}>
      <p>Capstone II</p>
      </Rectangle>

      <Rectangle buttonArray={["LiveTA", "Chats Feedback"]}>
      <p>Computer & Software Security</p>
      </Rectangle>
    </div>
  );
}

export default App;