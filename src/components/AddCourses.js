import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file

const AddCourses = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [yearSemester, setYearSemester] = useState('');
  const [totalStudents, setTotalStudents] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement the logic to handle the submission
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
        <p>Add a Course</p>
      </header>
      <div className="add-course-form">
        <h1>Adding a Course</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Course Name:
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          </label>
          <label>
            Course Code:
            <input type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
          </label>
          <label>
            Instructor Name:
            <input type="text" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} />
          </label>
          <label>
            Year & Semester (YYYY/SEM):
            <input type="text" value={yearSemester} onChange={(e) => setYearSemester(e.target.value)} />
          </label>
          <label>
            Total Number of Students:
            <input type="number" value={totalStudents} onChange={(e) => setTotalStudents(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
