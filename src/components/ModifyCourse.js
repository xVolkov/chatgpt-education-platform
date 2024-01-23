import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file

const coursesData = {
  'CS101': {
    courseName: 'Introduction to Computer Science',
    instructorName: 'Jane Doe',
    yearSemester: '2024/FALL',
    totalStudents: 120,
    files: ['syllabus.pdf', 'schedule.pdf']
  },
  'MATH201': {
    courseName: 'Advanced Calculus',
    instructorName: 'John Smith',
    yearSemester: '2024/SPRING',
    totalStudents: 80,
    files: ['assignments.zip', 'grades.xlsx']
  },
  // Add more courses as needed
};

const ModifyCourse = () => {
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState({});

  const handleCourseChange = (event) => {
    const courseCode = event.target.value;
    setSelectedCourseCode(courseCode);
    setCourseDetails(coursesData[courseCode] || {});
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

  const handleSubmit = () => {
    // Logic to handle the submit action
    console.log('Submitted', selectedCourseCode, courseDetails);
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
          <select value={selectedCourseCode} onChange={handleCourseChange}>
            <option value="">Select a course code</option>
            {Object.keys(coursesData).map(code => (
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
              Instructor Name:
              <input type="text" name="instructorName" value={courseDetails.instructorName || ''} onChange={handleDetailChange} />
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

export default ModifyCourse;
