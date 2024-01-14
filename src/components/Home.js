import React from 'react';
import './App.css';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import logo from './assets/logo.png';
import home from './assets/home.png';

function Rectangle({ children, buttonArray }) {
  const rectangleStyle = {
    backgroundColor: 'rgba(177, 227, 255, 0.5)',
    width: '25%',
    height: '450px',
    margin: '60px 20px 20px 20px',
    display: 'inline-block',
    textAlign: 'center',
    paddingTop: '1px',
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const buttonContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    backgroundColor: '#003C71',
    color: 'white',
    padding: '20px 15px',
    margin: '10px 0 10px 0', // Adjusted margin for spacing between buttons
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '60%', // Set the button width to 100%
    fontSize: '18px',
  };

  return (
    <div style={rectangleStyle}>
      {children}
      <div style={buttonContainerStyle}>
        {buttonArray.map((buttonText, index) => (
          <button key={index} style={buttonStyle}>{buttonText}</button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const headerStyle = {
    backgroundColor: '#003C71',
    padding: '0.5px',
    fontSize: '25px',
    opacity: '0.75',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', 
  };

  const secondHeaderStyle = {
    backgroundColor: '#003C71',
    padding: '0.5px',
    fontSize: '18px',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'Arial, sans-serif',
    display: 'flex', 
    alignItems: 'center', 
  };

  const settingStyle = {
    width: '30px', 
    marginRight: '10px', 
  };

  const profileStyle = {
    width: '45px', 
    marginRight: '10px',
  };

  const logoStyle = {
    width: '45px',
    marginRight: '10px', 
  };

  const homeStyle = {
    width: '30px',
    marginRight: '10px', 
  };

  const hiTeacherStyle = {
    fontSize: '16px', 
    fontWeight: 'normal', 
    marginRight: '10px', 
  };

  return (
    <div className="App">
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="logo" style={logoStyle} />
        <p>SmartLearnAI</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={profile} alt="profile" style={profileStyle} />
        <p style={hiTeacherStyle}>Hi Teacher1!</p>
        <img src={settings} alt="settings" style={settingStyle} />
      </div>
    </header>

      <header style={secondHeaderStyle}>
        <img src={home} alt="home" style={homeStyle} />
        <p>
          Dashboard
        </p>
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
