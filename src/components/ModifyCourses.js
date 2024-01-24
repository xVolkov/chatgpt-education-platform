import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file
import { wait } from '@testing-library/user-event/dist/utils';

const ModifyCourses = () => {
  const [courseCodes, setCourseCodes] = useState([]); // State to store course codes
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  
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
    // Fetch course details for the selected course
    const response = await fetch(`http://localhost:5000/get-course-details?code=${courseCode}`);
    const courseData = await response.json();
    setCourseDetails(courseData || {});
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setCourseDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleDeleteFile = (fileName) => {
    setCourseDetails({
      ...courseDetails,
      files: courseDetails.files.filter(file => file !== fileName)
    });
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
          <img src={profile} alt="profile" className="ProfileIcon" />
          <p className="HiTeacherText">Hi Teacher_Name!</p>
          <img src={settings} alt="settings" className="SettingIcon" />
        </div>
      </header>
      <header className="SecondHeader">
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
                {courseDetails.files && courseDetails.files.map(file => (
                  <li key={file}>
                    {file} <button onClick={() => handleDeleteFile(file)}>Delete</button>
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