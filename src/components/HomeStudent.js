import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../App.css';  // Import App-specific styles
import '../Home.css';  // Import the newly created styles file
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

import LiveAssistant from './LiveAssistant';
import ChatFeedbackStudent from './ChatFeedbackStudent';

function Rectangle({ children, buttons }) {

  const navigate = useNavigate();

  return (
    <div className="RectangleStudent">
      {children}
      <div className="RectangleButtonContainerStudent">
        {buttons.map((button, index) => (
          <button key={index} className={button.className}onClick={() => navigate(button.path)}>
            {button.text}
            </button>
        ))}
      </div>
    </div>
  );
}

function App() {

  const course = [
    { text: "LiveTA", path:"/live-assistant", className: "RectangleButtonStudent" },
    { text: "Add a Course", path: "/add-courses-student", className: "RectangleButtonStudent" },
    { text: "Chat Feedback", path: "/chat-feedback-student", className: "RectangleButtonStudent" }, 
  ];

  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [studentName, setStudentName] = useState('Student_Name!'); 
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch the teacher's name when the component mounts
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      // Adjust the URL to your actual endpoint
      fetch(`http://localhost:5000/user/${userID}`)
        .then(response => response.json())
        .then(data => {
          if (data.firstName) {
            setStudentName(`Hi ${data.firstName}!`);
          }
        })
        .catch(err => console.error('Error fetching student name:', err));
    }
  }, []);
  
  useEffect(() => {
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      fetch(`http://localhost:5000/get-student-courses/${userID}`)
        .then(response => response.json())
        .then(data => {
          setCourses(data); // Set the courses state with fetched data
        })
        .catch(err => console.error('Error fetching courses:', err));
    }
  }, []);
  
  const navigate = useNavigate();
  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  const handleHomeClick = () => {
    navigate('/home-student');
  }; 

  const handleProfileClick = () => {
    navigate('/user-profile');
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
            <button className="ProfileButton" onClick={handleProfileClick}>
              <img src={profile} alt="profile" className="ProfileIcon" />
            </button>
            <p className="HiStudentText">{studentName}</p>
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
      </header>

      <Routes>
        <Route path="/live-assistant" element={<LiveAssistant />} />
        <Route path="/chat-feedback-student" element={<ChatFeedbackStudent />} />
      </Routes>

      <Rectangle
          buttons={[
            { text: 'Add Course', path: '/add-courses-student' },
            { text: 'LiveTA', path: '/live-assistant' },
            { text: 'Chat Feedback', path: '/chat-feedback-student' },
          ]}
        >
      </Rectangle>
    </div>
  );
}

export default App;