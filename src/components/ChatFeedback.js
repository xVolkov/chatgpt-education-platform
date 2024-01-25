import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

// Mock data for courses and chats
const coursesAndChats = {
  'CS101': ['Chat 1', 'Chat 2', 'Chat 3'],
  'MATH201': ['Chat 1', 'Chat 2'],
  // Add more courses and chats as needed
};

const ChatFeedback = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedChat(''); // Reset chat selection when changing course
  };

  const handleChatChange = (event) => {
    setSelectedChat(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
  };  

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  const handleSubmit = () => {
    // Logic to submit the feedback
    console.log('Feedback submitted for', selectedCourse, selectedChat, feedback);
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
        <p>Chat Feedback</p>
      </header>
      <div className="chat-feedback-container">
        <h1>Chat Feedback</h1>
        <label>
          Select Course:
          <select value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select a course</option>
            {Object.keys(coursesAndChats).map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </label>

        {selectedCourse && (
          <label>
            Select Chat:
            <select value={selectedChat} onChange={handleChatChange}>
              <option value="">Select a chat</option>
              {coursesAndChats[selectedCourse].map(chat => (
                <option key={chat} value={chat}>{chat}</option>
              ))}
            </select>
          </label>
        )}

        {selectedChat && (
          <div>
            <label>
              Feedback:
              <textarea value={feedback} onChange={handleFeedbackChange} />
            </label>
          </div>
        )}

        <button onClick={handleSubmit}>Submit Feedback</button>
      </div>
    </div>
  );
};

export default ChatFeedback;
