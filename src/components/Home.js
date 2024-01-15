import React from 'react';
import './App.css';  // Import App-specific styles
import './Home.css';  // Import the newly created styles file
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

function Rectangle({ children, buttonArray }) {
  return (
    <div className="Rectangle">
      {children}
      <div className="RectangleButtonContainer">
        {buttonArray.map((buttonText, index) => (
          <button key={index} className="RectangleButton">{buttonText}</button>
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
          <p className="HiTeacherText">Hi Teacher1!</p>
          <img src={settings} alt="settings" className="SettingIcon" />
        </div>
      </header>

      <header className="SecondHeader">
        <img src={home} alt="home" className="HomeIcon" />
        <p>Dashboard</p>
      </header>

      <Rectangle buttonArray={["Talk to LiveTA", "Chats Feedback"]}>
        <p>Chat</p>
      </Rectangle>

      <Rectangle buttonArray={["Add a Course", "Modify a Course", "Generate Content", "Upload Files"]}>
        <p>Courses</p>
      </Rectangle>

      <Rectangle buttonArray={["Contact Support", "FAQs"]}>
        <p>Help & Guides</p>
      </Rectangle>
    </div>
  );
}

export default App;
