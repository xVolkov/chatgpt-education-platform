import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect} from 'react';
import '../App.css';  // Import App-specific styles
import '../Home.css';  // Import the newly created styles file

import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

import AddCourses from './AddCourses';
import ModifyCourses from './ModifyCourses';
import UploadFiles from './UploadFiles';
import LiveTA from './LiveTA';
import LiveAssistant from './LiveAssistant';
import TrainLiveTA from './TrainLiveTA';

function Rectangle({ children, buttons }) {

  const navigate = useNavigate();

  return (
    <div className="Rectangle">
      {children}
      <div className="RectangleButtonContainer">
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

  const courseButtons = [
    { text: "Add a Course", path: "/add-courses", className: "RectangleButton" },
    { text: "Modfiy a Course", path: "/modify-courses", className: "RectangleButton" }, // TO-DO: add a modify-courses page
    { text: "Train LiveTA", path: "/train-ta", className: "RectangleButton"},
    { text: "Upload Files", path: "/upload-files", className: "RectangleButton" }
  ];

  const chatButtons = [
    { text: "Talk to LiveTA", path: "/live-assistant", className: "RectangleButton" },
    { text: "Chat Feedback", path: "/chat-feedback", className: "RectangleButton" } // TO-DO: add a chat-feedback page
  ];

  const helpButtons = [
    { text: "Contact Support", path: "/contact-support", className: "RectangleButton" }, // TO-DO: add a Contact Support page
    { text: "FAQs", path: "/faqs", className: "RectangleButton" }, // TO-DO: add a FAQs page
  ];

  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [teacherName, setTeacherName] = useState('Teacher_Name!'); // State for teacher's name
  
  useEffect(() => {
    // Fetch the teacher's name when the component mounts
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      // Adjust the URL to your actual endpoint
      fetch(`http://localhost:5000/user/${userID}`)
        .then(response => response.json())
        .then(data => {
          if (data.firstName) {
            setTeacherName(`Hi ${data.firstName}!`);
          }
        })
        .catch(err => console.error('Error fetching teacher name:', err));
    }
  }, []);

  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
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
            <p className="HiTeacherText">{teacherName}</p>
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
          <Route path="/add-courses" element={<AddCourses />} />
          <Route path="/train-ta" element={<TrainLiveTA />} />
          <Route path="/upload-files" element={<UploadFiles />} />
          <Route path="/live-ta" element={<LiveTA />} />
          <Route path="/live-assistant" element={<LiveAssistant />} />
          <Route path="/modify-courses" element={<ModifyCourses />} />
      </Routes>

      <Rectangle buttons={chatButtons}>
        <p>Chat</p>
      </Rectangle>

      <Rectangle buttons={courseButtons}>
        <p>Courses</p>
      </Rectangle>

      <Rectangle buttons={helpButtons}>
        <p>Help & Guides</p>
      </Rectangle>
    </div>
  );
}

export default App;