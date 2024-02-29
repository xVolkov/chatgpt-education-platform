import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const ContactSupport = () => {
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [teacherName, setTeacherName] = useState('Teacher_Name!'); // State for teacher's name
  
  // ######################### FETCHING USER'S FIRSTNAME FROM MONGO-DB #########################
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

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleInquiryChange = (event) => {
    setInquiry(event.target.value);
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
  };
  
  const handleProfileClick = () => {
    navigate('/user-profile');
  }; 

  const handleSubmit = () => {
    console.log('Support Inquiry Submitted:', topic, inquiry);
    // Reset form
    setTopic('');
    setInquiry('');
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
          <button className="ProfileButton" onClick={handleProfileClick}>
            <img src={profile} alt="profile" className="ProfileIcon" />
          </button>
          <p className="HiTeacherText">{teacherName}</p>
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
        <p>Contact Support</p>
      </header>
      <div className="contact-supp-container">
        <h1>Contact Support</h1>
        <label>
          Select Topic:
          <select value={topic} onChange={handleTopicChange}>
            <option value="">Choose a topic</option>
            <option value="account_issues">Account Issues</option>
            <option value="course_issues">Course Issues</option>
            <option value="technical_support">Technical Support</option>
            <option value="general_inquiry">General Inquiry</option>
            {/* Add more topics as needed */}
          </select>
        </label>

        <label>
          Your Inquiry:
          <textarea value={inquiry} onChange={handleInquiryChange} />
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ContactSupport;
