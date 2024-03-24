import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const AddCourses = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  //const [instructorName, setInstructorName] = useState('');
  const [yearSemester, setYearSemester] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
// Error Checking / Input Validation:
  const [courseNameError, setCourseNameError] = useState('');
  const [courseCodeError, setCourseCodeError] = useState('');
  //const [instructorNameError, setInstructorNameError] = useState('');
  const [yearSemesterError, SetYearSemesterError] = useState('');
  const [totalStudentsError, setTotalStudentsError] = useState('');

  const [courseCodes, setCourseCodes] = useState([]); // State to store course codes
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [courseDetails, setCourseDetails] = useState({});
  const [courseFiles, setCourseFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
  const [serverResponse, setServerResponse] = useState(''); // Displays python flask server response
  const navigate = useNavigate(); // Hook for navigation
  const [studentName, setStudentName] = useState('Student_Name!'); 

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-all-courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };


  // Fetch course codes from the server
  useEffect(() => {
    // Fetch the teacher's name when the component mounts
    const userID = sessionStorage.getItem('userID');
    if (userID) {
      // Adjust the URL to your actual endpoint
      fetch(`http://localhost:5000/user/${userID}`)
        .then(response => response.json())
        .then(data => {
          if (data.firstName) {
            setStudentName(`Hi ${data.firstName}!`);
          }
        })
        .catch(err => console.error('Error fetching student name:', err));
    }
  }, []);

  const handleHomeClick = () => {
    navigate('/home-student');
  };  

  const handleProfileClick = () => {
    navigate('/user-profile');
  }; 

  const handleSignOut = () => {
    sessionStorage.clear(); // Clear the session storage
    //alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
    navigate('/'); // Navigate to the login/register component
  };

  function validateForm() {
    let isValid = true;
    if (!courseName) {
      setCourseNameError('Please enter the course name');
      isValid = false;
    } else {setCourseNameError('');}

    if (!courseCode) {
      setCourseCodeError('Please enter the course code');
      isValid = false;
    } else {setCourseCodeError('');}

    /*if (!instructorName) {
      setInstructorNameError('Please enter the instructor name');
      isValid = false;
    } else {setInstructorNameError('');}
    */

    if (!yearSemester){
      SetYearSemesterError("Please enter the year & semester");
      isValid = false;
    } else {SetYearSemesterError('');}

    if (!totalStudents) {
      setTotalStudentsError('Please enter the total number of students');
      isValid = false;
    } else {setTotalStudentsError('');}

    return isValid;
  }

  const handleCourseChange = async (event) => {
    const courseCode = event.target.value;
    setSelectedCourseCode(courseCode);
    // Fetch course details for the selected course
    const response = await fetch(`http://localhost:5000/get-course-details?code=${courseCode}`);
    const courseData = await response.json();
    setCourseDetails(courseData || {});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const studentID = sessionStorage.getItem('userID');
    if (!studentID) {
      alert('Please logout and login again before continuing');
      return;
    }
  
    const selectedCourse = courseCode;
  
    try {
      const response = await fetch('http://localhost:5000/add-student-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentID, courseCode: selectedCourse })
      });
  
      if (response.ok) {
        alert('Course successfully added to your courses.');
        navigate('/home-student'); // Redirect user to student home page
      } else {
        const jsonResponse = await response.json();
        console.error(jsonResponse.message);
        alert('Failed to add course. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An error occurred while adding the course to your courses.');
    }
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
          <p className="HiStudentText">{studentName}</p>
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
        <p>Add a Course</p>
      </header>
      <div className="modify-course-container">
        <h1>Adding a Course</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Select a Course:
            <select onChange={(e) => setCourseCode(e.target.value)}>
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.courseCode}>
                  {course.courseName} - {course.courseCode}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;