import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const ChatFeedback = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState('');
  const [feedback, setFeedback] = useState('');
  const [chats, setChats] = useState([]); // State to hold chats fetched from the server
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

  useEffect(() => {
    axios.get('http://localhost:5000/fetch_chats')
      .then(response => {
        setChats(response.data.chats); // Assuming the response has a chats field
      })
      .catch(error => console.error("Error fetching chats:", error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/fetch_chats')
      .then(response => {
        const filteredChats = response.data.chats.filter(chat => chat.userID === sessionStorage.getItem('userID'));
        setChats(filteredChats);
      })
      .catch(error => console.error("Error fetching chats:", error));
  }, []);

  const handleChatChange = (event) => {
    setSelectedChat(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
  }; 
  
  const handleProfileClick = () => {
    navigate('/user-profile');
  }; 

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    //alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  const handleSubmit = () => {
    // Prepare the feedback data
    const feedbackData = {
      chatTitle: selectedChat, // Assuming selectedChat contains the title of the selected chat
      feedback: feedback
    };
  
    // Send a POST request to submit the feedback
    axios.post('http://localhost:5000/submit-feedback', feedbackData)
      .then(response => {
        console.log(response.data.message); // Log the success message
        alert('Feedback submitted. Thank you!');
        setFeedback(''); // Clear the feedback input
        setSelectedChat(''); // Clear the selected chat
      })
      .catch(error => {
        console.error('Error submitting feedback:', error); // Log any errors
        alert('An error occurred while submitting feedback. Please try again later.');
      });
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
          <p className="HiStudentText">{teacherName}</p>

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
          Select Chat:
          <select value={selectedChat} onChange={(e) => setSelectedChat(e.target.value)}>
            <option value="">Select a chat</option>
            {chats.map((chat, index) => (
              <option key={index} value={chat.chatID} title={chat.chatLog}>
                {chat.title}
              </option>
            ))}
          </select>
        </label>
        {selectedChat && (
          <div>
            <label>
              Feedback:
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </label>
            <button onClick={handleSubmit}>Submit Feedback</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFeedback;
