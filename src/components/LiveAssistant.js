import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const LiveAssistant = () => {
  const [action, setAction] = useState('');
  const [userFile, setUserFile] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState(''); // State to hold the response
  const [ws, setWs] = useState(null);
  const [chatLog, setChatLog] = useState({});

  const fileInputRef = useRef(null); // Use useRef hook to create a ref for your file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [teacherName, setTeacherName] = useState('Teacher_Name!'); // State for teacher's name
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const navigate = useNavigate();

  const [courseCodes, setCourseCodes] = useState([]); // Stores all fetched courses from DB
  const [selectedCourseCode, setSelectedCourseCode] = useState(''); // Storing selected course code
  const [selectedCourseCodeTemp, setSelectedCourseCodeTemp] = useState(''); // Temp storing course code (for form handling)
  const [previewSelectedCourse, setPreviewSelectedCourse] = useState('');

  const userType = sessionStorage.getItem('userType');
  const userID = sessionStorage.getItem('userID');

  // ######################### WEB-SOCKET CONNECTION SETUP #########################
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    setWs(websocket);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setResponse(message.message); // Assuming the server sends back a JSON with a 'message' field
      logMessages(response)
    };
    return () => {
      websocket.close();
    };
  }, []);
  
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

  // ######################### FETCHES COURSES RELATED TO LOGGED-IN USER #########################
  useEffect(() => { 
    const fetchCourseCodes = async () => {
      if (userType === 'Teacher'){
        const teacherID = sessionStorage.getItem('userID');
        try {
          const response = await fetch(`http://localhost:5000/get-course-codes?teacherID=${teacherID}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setCourseCodes(data.courseCodes);
        } catch (error) {
          console.error('Error fetching course codes:', error);
        }
      } else {
        try {
          const response = await fetch(`http://localhost:5000/get-all-course-codes`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setCourseCodes(data.courseCodes);
        } catch (error) {
          console.error('Error fetching course codes:', error);
        }
      }
    };
    fetchCourseCodes();
  }, []);

  // ######################### CHECKS IF A COURSE HAS BEEN SELECTED ######################### 
  useEffect(() => {
    const chatForm = document.querySelector('.chat-form');
    const uploadForm = document.querySelector('.upload-files-form');
  
    if (selectedCourseCode) {
      chatForm.style.display = 'block'; // Show chat form
      uploadForm.style.display = 'none'; // Hide upload files form
    } else {
      chatForm.style.display = 'none'; // Keep chat form hidden
    }
  }, [selectedCourseCode]); // Dependence on selectedCourseCode
  
  // ######################### HANDLES COURSE SELECTION CHANGE #########################
  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    if (userType == 'Teacher'){
      setPreviewSelectedCourse(courseCode);
      setSelectedCourseCodeTemp(courseCode);
    } else {
      const studentCourseCode = courseCode + '-Student';
      setPreviewSelectedCourse(courseCode);
      //alert(studentCourseCode);
      setSelectedCourseCodeTemp(studentCourseCode);
    }
  };

  // #################### SENDS USER SELECTED COURSE CODE TO SERVER  ####################
  const sendSelectedCourseCode = async () => {
    setSelectedCourseCode(selectedCourseCodeTemp)
    try {
      const response = await fetch('http://localhost:3002/selected-course', {
        headers: {'Content-Type': 'application/json',},
        method: 'POST',
        body: JSON.stringify({selectedCourseCodeTemp}),
      });

      if (!response.ok) throw new Error('Connection to server failed');
      //alert(`Successfully sent ${selectedCourseCodeTemp} course code to server`);

    } catch (error) {
      console.error('Error:', error);
      alert('Connection to server failed');
    }
  };

  // #################### SENDS USER SELECTED COURSE CODE TO SERVER  ####################
  const sendUserID = async () => {
    try {
      const response = await fetch('http://localhost:3002/user-id', {
        headers: {'Content-Type': 'application/json',},
        method: 'POST',
        body: JSON.stringify({userID}),
      });

      if (!response.ok) throw new Error('Connection to server failed');
      alert(`Successfully sent ${userID} as the current user ID to the server`);

    } catch (error) {
      console.error('Error:', error);
      alert('Connection to server failed');
    }
  };

  // #################### SENDS ALL NEEDED INFO TO SERVER ####################
  const sendInfo = () =>{
    sendSelectedCourseCode();
    sendUserID();
  }
  
  // #################### LOGS MESSAGES ####################
  const logMessages = (message) =>{
    setChatLog(message);
  }

  // #################### Handles Sending a Question ####################
  const handleAskQuestion = () => {
    if (ws) {
      ws.send(JSON.stringify({
        action: "1",
        userQuestion: userQuestion,
        userFile: "null"
      }));
    }
    logMessages(userQuestion);
    setUserQuestion('');
  };

  // #################### Handles Uploading Files to Assistant ####################
  const handleUploadToAssistant = (fileName) => {
    const act = "2";
    const question = "null";

    if (ws) {
      ws.send(JSON.stringify({
        action: act,
        userQuestion: question,
        userFile: fileName
      }));
    }
    logMessages(userQuestion);
    setSelectedFile(null);
    fileInputRef.current.value = '';
  };

  // #################### HANDLES THE FILE UPLOAD LOGIC ####################
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:3002/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      //alert('File uploaded successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Upload failed');
    }
    //alert(selectedFile.name) // DEBUG STATEMENT - PRINTS THE NAME OF THE FILE ABOUT TO BE UPLOADED
    const fileName = selectedFile.name
    handleUploadToAssistant(fileName)
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleHomeClick = () => {
    if (userType === 'Teacher'){
      navigate('/home-teacher');
    }else{
      navigate('/home-student');
    }
    
  };  

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID')); // DEBUG - Confirms user signed out
    navigate('/'); // Navigate to the login/register component
  };

  // ################################ HTML CODE ##################################
  return (
    <div>
      <header className="AppHeader">
        <div className="AppHeaderLeft">
          <img src={logo} alt="logo" className="LogoIcon" />
          <p>SmartLearnAI</p>
        </div>
        <div className="AppHeaderRight">
          <img src={profile} alt="profile" className="ProfileIcon" />
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
        <p>LiveTA - {selectedCourseCodeTemp}</p>
      </header>

        <div className="chat-form" style={{display: 'none'}}>
          <h2>Ask a Question or Upload File to LiveTA</h2>
          <div className="chat-form">
            
              <textarea readOnly value={response} style={{ width: '90%', height: '300px' }} ></textarea>
              <div>
                <input
                  type='text'
                  placeholder="Type your question here"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  style={{ width: '80%', marginTop:'20px'}}
                />
                <button onClick={handleAskQuestion}>Send</button>
              </div>
            
            <h2>Select a File to Upload</h2>
            <div>
              <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
              <button onClick={handleUpload}>Upload</button>
            </div>
          </div>
        </div>

          <div className="upload-files-form">
            <h1>Select a Course</h1>
                <label>
                    <select onChange={handleCourseChange} value={previewSelectedCourse} >
                        <option value="">Select a course code</option>
                        {courseCodes.map(code => (
                        <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                </label>
                <button onClick={sendInfo}>Submit</button>
          </div>

  </div>
  );
};

export default LiveAssistant;