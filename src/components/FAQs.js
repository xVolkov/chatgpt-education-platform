import React from 'react';
import logo from './assets/logo.png';
import settings from './assets/settings.png';
import profile from './assets/profile.png';
import '../styles.css'; // Import the CSS file

const faqs = [
  { question: 'How do I reset my password?', answer: 'To reset your password, go to the settings page and click on "Reset Password".' },
  { question: 'Where can I find the latest updates?', answer: 'Latest updates can be found on the updates section of our homepage.' },
  { question: 'Can I modify my courses?', answer: 'Yes, you can do so by clicking on "Modify a Course" button on the homepage.' },
  // ... Add more FAQs here
];

const FAQs = () => {
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
        <p>Frequently Asked Questions</p>
      </header>

      <div className="faqs">
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="faq">
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
