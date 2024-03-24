import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const faqs = [
  { question: 'How do I access my profile settings?', answer: 'Click on the profile icon at the top right of the screen (beside your firstname) to access the profile settings.' },
  { question: 'Where can I find the latest updates?', answer: 'Latest updates can be found on the updates section of our homepage.' },
  { question: 'Can I modify my courses?', answer: 'Yes, you can do so by clicking on "Modify a Course" button on the homepage.' },
  // ... Add more FAQs here
];

const FAQs = () => {
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const navigate = useNavigate();

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

  const handleHomeClick = () => {
    navigate('/home-teacher');
  };
  
  const handleProfileClick = () => {
    navigate('/user-profile');
  }; 
  
  const handleSignOut = () => {
    sessionStorage.clear(); 
    //alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); 
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
        <p>Frequently Asked Questions</p>
      </header>

      <div className="faqs">
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="faq">
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
