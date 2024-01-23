import React, { useState } from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file

const ContactSupport = () => {
  const [topic, setTopic] = useState('');
  const [inquiry, setInquiry] = useState('');

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleInquiryChange = (event) => {
    setInquiry(event.target.value);
  };

  const handleSubmit = () => {
    // Logic to handle submission, e.g., send to a server
    console.log('Support Inquiry Submitted:', topic, inquiry);
    // Reset form
    setTopic('');
    setInquiry('');
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
        <p>Contact Support</p>
      </header>
      <div className="contact-supp-container">
        <h1>Contact Support</h1>
        <label>
          Select Topic:
          <select value={topic} onChange={handleTopicChange}>
            <option value="">Choose a topic</option>
            <option value="account_issues">Account Issues</option>
            <option value="course_issues">Course Issues</option>
            <option value="technical_support">Technical Support</option>
            <option value="general_inquiry">General Inquiry</option>
            {/* Add more topics as needed */}
          </select>
        </label>

        <label>
          Your Inquiry:
          <textarea value={inquiry} onChange={handleInquiryChange} />
        </label>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ContactSupport;
