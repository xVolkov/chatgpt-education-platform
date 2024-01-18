import React from 'react';
import './App.css';  // Import App-specific styles
import './Home.css';  // Import the newly created styles file
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

function Rectangle({ children, buttonArray }) {
  return (
    <div className="RectangleStudent">
      {children}
      <div className="RectangleButtonContainerStudent">
        {buttonArray.map((buttonText, index) => (
          <button key={index} className="RectangleButtonStudent">{buttonText}</button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="AppHeader">
        <div className="AppHeaderLeft">
          <img src={logo} alt="logo" className="LogoIcon" />
          <p>SmartLearnAI</p>
        </div>
        <div className="AppHeaderRight">
          <img src={profile} alt="profile" className="ProfileIcon" />
          <p className="HiTeacherText">Hi Student1!</p>
          <img src={settings} alt="settings" className="SettingIcon" />
        </div>
      </header>

      <header className="SecondHeader">
        <img src={home} alt="home" className="HomeIcon" />
        <p>Dashboard</p>
        <p>Course Enrollment</p>
        <p>Feedback</p>
      </header>

      <Rectangle buttonArray={["Lecture Notes", "Assignments", "Quizzes", "LiveTA"]}>
      <p>Cloud Computing</p>
      </Rectangle>

      <Rectangle buttonArray={["Lecture Notes", "Assignments", "Quizzes", "LiveTA"]}>
      <p>Modelling and Simulations</p>
      </Rectangle>

      <Rectangle buttonArray={["Lecture Notes", "Assignments", "Quizzes", "LiveTA"]}>
      <p>Capstone II</p>
      </Rectangle>

      <Rectangle buttonArray={["Lecture Notes", "Assignments", "Quizzes", "LiveTA"]}>
      <p>Computer and Software Security</p>
      </Rectangle>
    </div>
  );
}

export default App;
