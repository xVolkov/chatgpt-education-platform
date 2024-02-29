import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css';

const TrainLiveTA = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [courseCodes, setCourseCodes] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [files, setFiles] = useState([]);
  const[selectedFiles, setSelectedFiles] = useState([])
  const [ws, setWs] = useState(null);
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

  // ######################### WEB-SOCKET CONNECTION SETUP #########################
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    setWs(websocket);
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.message == "LiveTA is typing.."){
        alert("LiveTA is reading the file..")
      } else {
        alert(message.message);
      }
    };
    return () => {
      websocket.close();
    };
  }, []);

  // ######################### FETCHES COURSES RELATED TO LOGGED-IN USER #########################
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

  // ######################### FETCHES FILES RELATED TO SELECTED COURSE CODE #########################
  useEffect(() => { 
    const fetchFilesForCourse = async () => {
      if (selectedCourseCode) { // Only fetch files if a course code is selected
        try {
          const response = await axios.get(`http://localhost:5000/get-course-files`, {
            params: { courseCode: selectedCourseCode }
          });
          // Assuming the endpoint returns an array of files
          const returnedFiles = response.data; // Assuming the response data is the array of files
          setFiles(returnedFiles);
        } catch (error) {
          console.error('Error fetching files for the selected course:', error);
        }
      }
    };
    fetchFilesForCourse(); // Call the function to fetch files when the selected course code changes
  }, [selectedCourseCode]); // Dependency array includes selectedCourseCode to re-run the effect when it changes


  // ################################ FUNCTIONS ################################

  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    setSelectedCourseCode(courseCode);
    };

  const handleHomeClick = () => {
    navigate('/home-teacher');
    };
      
  const handleProfileClick = () => {
    navigate('/user-profile');
  }; 


  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    alert('Logged-in User ID: ' + sessionStorage.getItem('userID')); // DEBUG - Confirms user signed out
    navigate('/'); // Navigate to the login/register component
    };

    const handleFileSelection = (event) => {
        const fileIndex = parseInt(event.target.value, 10); // Convert the value to a number
        const fileToToggle = files[fileIndex]; // Access the file object using the index

        if (event.target.checked) {
            setSelectedFiles([...selectedFiles, fileToToggle]);
        } else {
            setSelectedFiles(selectedFiles.filter(file => file !== fileToToggle));
        }
    };

    // #################### Handles Uploading Files to Assistant ####################
    const handleUploadToAssistant = (fileName) => {
        if (ws) {
        ws.send(JSON.stringify({
            action: "2",
            userQuestion: "null",
            userFile: fileName
        }));
        }
    };

    const handleUpload = async (fileToUpload, givenFileName) => {
        const formData = new FormData();
            formData.append('file', fileToUpload); // Adjust based on your file structure
            try {
                const response = await fetch('http://localhost:3002/upload-file', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('File upload failed');
                } else {
                    alert(`Successfully uploaded ${givenFileName} to the server database.`);
                }
                } catch (error) {
                    console.error('Error:', error);
                    alert('File upload failed');
                }handleUploadToAssistant(givenFileName)
            };

    const formatFiles = () => {
        selectedFiles.forEach(fileInArray => {
            if (!fileInArray) {
            console.error('File not found');
            alert('File not found');
            return; // Skip this iteration if the file object is not found
            }
            getFileFromDB(fileInArray._id, fileInArray.fileName)
        });
    };

    // Gets the file's BLOB from the MongoDB, converts it to a file object and then sends it to handleUpload
    const getFileFromDB = async (fileID, givenFileName) => {
        try {
            const response = await axios.get(`http://localhost:5000/download-file?fileID=${fileID}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // Create a file from the blob:
            const file = new File([blob], givenFileName, { type: blob.type });
            handleUpload(file, givenFileName)

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

  // ################################ HTML ################################
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
        <p>Upload Files</p>
      </header>

      <div className="upload-files-form">
        <h1>Train LiveTA Portal</h1>
        <form>
            <label>
            Select a Course:
                <select onChange={handleCourseChange} value={selectedCourseCode} >
                    <option value="">Select a course code</option>
                    {courseCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                    ))}
                </select>
            </label>
        </form>
      </div>

        <div className="file-selection" style={{ textAlign: 'center' }}>
        {files.map((file, index) => (
            <div key={file._id}>
                <input
                    type="checkbox"
                    id={file._id}
                    name="selectedFiles"
                    value={index}
                    onChange={handleFileSelection} // Implement this function to update state
                />
            <label htmlFor={file._id}>{file.fileName}</label> {/* Adjust based on your file object structure */}
            </div>
        ))}
        </div>
        <button type="button" onClick={formatFiles}>Upload Selected Files</button>
    </div>
  );
};

export default TrainLiveTA;