import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../App.css';  // Import App-specific styles
import '../Home.css';  // Import the newly created styles file
import '../styles.css'; // Import the CSS file
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

import LiveTA from './LiveTA';
import ChatFeedback from './ChatFeedback';
import ContactSupport from './ContactSupport';

function Rectangle({ children, buttons }) {

  const navigate = useNavigate();

  return (
    <div className="RectangleStudent">
      {children}
      <div className="RectangleButtonContainerStudent">
        {buttons.map((button, index) => (
          <button key={index} className="RectangleButtonStudent"onClick={() => navigate(button.path)}>
            {button.text}
            </button>
        ))}
      </div>
    </div>
  );
}

function App() {

  const course = [
    { text: "LiveTA", path:"/live-ta", className: "RectangleButton" },
    { text: "Chat Feedback", path: "/chat-feedback", className: "RectangleButton" }, 
  ];

  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const navigate = useNavigate();
  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  const handleHomeClick = () => {
    navigate('/home-student');
  }; 

  const handleSuppClick = () => {
    navigate('/contact-support');
  }; 

  return (
    <div className="App">
      <header className="AppHeader">
        <div className="AppHeaderLeft">
          <img src={logo} alt="logo" className="LogoIcon" />
          <p>SmartLearnAI</p>
        </div>

        <div className="AppHeaderRight">
          <div className="profile-section">
            <img src={profile} alt="profile" className="ProfileIcon" />
            <p className="HiTeacherText">Hi Student1!</p>
          </div>
          <div className="settings-section">
            <img
              src={settings}
              alt="settings"
              className={`SettingIcon ${showDropdown ? 'show-dropdown' : ''}`}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleSignOut}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <header className="SecondHeader">
        <button className="HomeButton" onClick={handleHomeClick}>
          <img src={home} alt="home" className="HomeIcon" />
        </button>
        <p>Add Courses</p>
        <button className="ContactSupportButton" onClick={handleSuppClick}>
          Contact Support
        </button>
      </header>

      <Routes>
          <Route path="/chat-feedback" element={<ChatFeedback />} />
          <Route path="/live-ta" element={<LiveTA />} />
      </Routes>

      <Rectangle buttons={course}>
      <p>Cloud Computing</p>
      </Rectangle>

      <Rectangle buttons={course}>
      <p>Modelling and Simulations</p>
      </Rectangle>

      <Rectangle buttons={course}>
      <p>Capstone II</p>
      </Rectangle>

      <Rectangle buttons={course}>
      <p>Computer & Software Security</p>
      </Rectangle>
    </div>
  );
}

export default App;