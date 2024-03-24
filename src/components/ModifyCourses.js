import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import trash from './assets/delete.png';
import download from './assets/download.png';
import '../styles.css'; // Import the CSS file
import { wait } from '@testing-library/user-event/dist/utils';

const ModifyCourses = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [courseCodes, setCourseCodes] = useState([]); // State to store course codes
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  const [courseFiles, setCourseFiles] = useState([]);
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
      const userType = sessionStorage.getItem('userType'); // Assuming userType is stored in sessionStorage
      try {
        const response = await fetch(`http://localhost:5000/get-course-codes?userID=${teacherID}&userType=${userType}`);
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

  useEffect(() => {
    // Fetch files for the selected course
    const fetchCourseFiles = async () => {
      if (selectedCourseCode) {
        const response = await axios.get(`http://localhost:5000/get-course-files?courseCode=${selectedCourseCode}`);
        setCourseFiles(response.data);
      }
    };
    fetchCourseFiles();
  }, [selectedCourseCode]);

  const deleteFile = async (fileID) => {
    try {
      await axios.post('http://localhost:5000/delete-file', { fileID });
      // Refresh the files list
      setCourseFiles(courseFiles.filter(file => file._id !== fileID));
      alert(`File has been deleted!`)
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFile = async (fileID) => {
    try {
      const response = await axios.get(`http://localhost:5000/download-file?fileID=${fileID}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary <a> element with the download link
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition && contentDisposition.match(/filename=([^;]+)/); // Updated regex
      const fileName = fileNameMatch ? fileNameMatch[1] : 'downloaded_file'; // Provide a default name if filename is not found
      a.download = fileName;
      a.style.display = 'none';
      
      // Append the <a> element to the DOM and trigger a click event
      document.body.appendChild(a);
      a.click();
      
      // Clean up by removing the <a> element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    setSelectedCourseCode(courseCode);
    // Fetch course details for the selected course
    const response = await fetch(`http://localhost:5000/get-course-details?code=${courseCode}`);
    const courseData = await response.json();
    setCourseDetails(courseData || {});
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setCourseDetails(prevDetails => ({ ...prevDetails, [name]: value }));
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

  const handleSubmit = async () => {
    // Logic to handle the submit action
    await fetch('http://localhost:5000/update-course', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseCode: selectedCourseCode, courseDetails }),
    });
    console.log('Submitted', selectedCourseCode, courseDetails);

    // Reset selectedCourseCode and courseDetails after submission
    setSelectedCourseCode('');
    setCourseDetails({});
    alert("Course successfully modified!")
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
        <p>Modify a Course</p>
      </header>
      
      <div className="modify-course-container">
        <h1>Modify a Course</h1>
        <label>
          Course Code:
          <select onChange={handleCourseChange} value={selectedCourseCode} >
            <option value="">Select a course code</option>
            {courseCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>

        {selectedCourseCode && (
          <div>
            <label>
              Course Name:
              <input type="text" name="courseName" value={courseDetails.courseName || ''} onChange={handleDetailChange} />
            </label>
            <label>
              Year/Semester:
              <input type="text" name="yearSemester" value={courseDetails.yearSemester || ''} onChange={handleDetailChange} />
            </label>
            <label>
              Total Number of Students:
              <input type="number" name="totalStudents" value={courseDetails.totalStudents || ''} onChange={handleDetailChange} />
            </label>
            
            <div>
              Files:
              <ul>
                {courseFiles.map(file => (
                  <li key={file._id}>
                    {file.fileName} 
                    <button onClick={() => deleteFile(file._id)}>
                      <img src={trash} alt="Delete" />
                    </button>
                    <button onClick={() => downloadFile(file._id)}>
                      <img src={download} alt="Download" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button onClick={handleSubmit}>Submit</button>

      </div>
    </div>
  );
};

export default ModifyCourses;