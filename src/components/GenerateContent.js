import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file

const GenerateContent = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentComplexity, setContentComplexity] = useState('');

  const handleGenerate = () => {
    // Logic to generate and download content
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
          <img src={settings} alt="settings" className="SettingIcon" />
        </div>
      </header>
      <header className="SecondHeader">
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
