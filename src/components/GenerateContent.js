import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const GenerateContent = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [selectedCourse, setSelectedCourse] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentComplexity, setContentComplexity] = useState('');

  const OpenAI = require("openai"); // OPENAI module
  // Create a OpenAI connection
  const secretKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: secretKey,
  });

  const handleGenerate = () => {
    // Logic to generate and download content
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
  }; 

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  return (
    <div>
      <header className="AppHeader">
        <div className="AppHeaderLeft">
          <img src={logo} alt="logo" className="LogoIcon" />
          <p>SmartLearnAI</p>
        </div>
        <div className="AppHeaderRight">
          <img src={profile} alt="profile" className="ProfileIcon" />
          <p className="HiTeacherText">Hi Teacher_Name!</p>
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
        <p>Generate Content</p>
      </header>

      <div className="content-generation-form">
        <h1>Course Content Generation</h1>
        <div>
          <label>
            Select a Course:
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              {/* Options should be dynamically generated based on available courses */}
            </select>
          </label>
          <label>
            Content Type:
            <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
              {/* Options */}
            </select>
          </label>
          <label>
            Content Complexity:
            <select value={contentComplexity} onChange={(e) => setContentComplexity(e.target.value)}>
              {/* Options */}
            </select>
          </label>
          <button onClick={handleGenerate}>Generate & Download</button>
        </div>
      </div>
    </div>
  );
};

export default GenerateContent;
