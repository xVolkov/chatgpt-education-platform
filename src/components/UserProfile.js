import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import home from './assets/home.png';
import '../styles.css'; // Import the CSS file

const UserProfile = () => {
    const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility
    const [teacherName, setTeacherName] = useState('Teacher_Name!'); // State for teacher's name
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
  
    useEffect(() => {
        // Fetch the user's data when the component mounts
        const userID = sessionStorage.getItem('userID');
        if (userID) {
            // Adjust the URL to your actual endpoint
            fetch(`http://localhost:5000/user/${userID}`)
            .then(response => response.json())
            .then(data => {
                if (data.firstName) {
                    setTeacherName(`Hi ${data.firstName}!`);
                    setUserData(data); // Set user data fetched from backend
                }
            })
            .catch(err => console.error('Error fetching user data:', err));
        }
    }, []);

    const handleHomeClick = () => {
        if (userData.userType === 'Teacher') {
          navigate('/home-teacher');
        } else if (userData.userType === 'Student') {
          navigate('/home-student');
        } else {
          navigate('/');
        }
      };

    const handleProfileClick = () => {
        navigate('/user-profile');
    }; 
    
    const handleSignOut = () => {
      sessionStorage.clear(); 
      alert('Logged-in User ID: ' + sessionStorage.getItem('userID'));
      navigate('/'); 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement logic to update user data
        console.log('Updated User Data:', userData);
    
        // Prepare updated user data to send to the backend
        const updatedUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };
    
        // Fetch the user's ID from session storage
        const userID = sessionStorage.getItem('userID');
    
        // Make a POST request to update user data
        fetch(`http://localhost:5000/user/${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('User data updated successfully:', data);
            // Reload the page
            window.location.reload();
        })
        .catch(err => console.error('Error updating user data:', err));
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
                <p>User Profile</p>
            </header>

            <div className="add-course-form">
                <h1>Update Profile</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name
                        <input type="text" name="firstName" value={userData.firstName} onChange={handleChange}/>
                        <span className="error-message"></span>
                    </label>

                    <label>
                        Last Name
                        <input type="text" name="lastName" value={userData.lastName} onChange={handleChange}/>
                        <span className="error-message"></span>
                    </label>

                    <label>
                        Email
                        <input type="text" name="email" value={userData.email} onChange={handleChange}/>
                        <span className="error-message"></span>
                    </label>

                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
