import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const UploadFiles = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [courseCodes, setCourseCodes] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null); // Create a ref for the file input
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
  
  // Fetch course codes from the server
  useEffect(() => {
    const fetchCourseCodes = async () => {
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
    };

    fetchCourseCodes();
    
  }, []);

  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    setSelectedCourseCode(courseCode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (!file) return;

    const validExtensions = [".pdf", ".pptx", ".docx", ".txt"];
    if (!validExtensions.includes(file.name.slice(-5)) && !validExtensions.includes(file.name.slice(-4))) {
      alert("Please select only .pdf, .txt, .pptx, or .docx files.");
      return;
    }
    
    setSelectedFile(file);
    setFileName(file.name);
    setFileExtension(file.name.split('.').pop());
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    const userID = sessionStorage.getItem('userID');
    if (!userID) {
      alert('User is not logged in');
      return;
    }

    if (!selectedFile) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('courseCode', selectedCourseCode);
    formData.append('userID', userID);
    formData.append('fileType', fileType);
    formData.append('fileExtension', fileExtension);
    formData.append('fileName', fileName);

    try {
      await axios.post('http://localhost:5000/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset the file input by clearing its current value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reset form after successful upload
      setSelectedCourseCode('');
      setFileType('');
      setFileExtension('');
      setSelectedFile(null);
      setFileName('');

      alert('File uploaded successfully');

    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/home-teacher');
  };  

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID')); // DEBUG - Confirms user signed out
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
        <p>Upload Files</p>
      </header>

      <div className="upload-files-form">
        <h1>Course Files Upload Portal</h1>
        
        <form onSubmit={handleFileUpload}>
          
          <label>
            Select a Course:
            <select onChange={handleCourseChange} value={selectedCourseCode} >
            <option value="">Select a course code</option>
            {courseCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>

          <label>
            File Type:
            <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
            <option value="">Select a file type</option>
              <option value="Course Outline">Course Outline</option>
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Assignment">Assignment</option>
              <option value="Exam">Exam</option>
              <option value="Quiz">Quiz</option>
              <option value="Textbook">Textbook</option>
            </select>
          </label>
          
          <label>
          </label>
          <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
          <button type="submit">Submit</button>

        </form>

      </div>
    </div>
  );
};

export default UploadFiles;
