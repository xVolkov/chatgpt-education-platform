import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles.css';

// Login/Register:
import LoginRegister from './components/LoginRegister';
import LoginTeacher from './components/LoginTeacher';
import LoginStudent from './components/LoginStudent';
import ForgotPassword from './components/ForgotPassword';
import RegisterTeacher from './components/RegisterTeacher';
import RegisterStudent from './components/RegisterStudent';
import RegistrationConfirmation from './components/RegisterConfirmation';
// Teacher Home Page:
import HomeTeacher from './components/HomeTeacher';
import AddCourses from './components/AddCourses';
import ModifyCourses from './components/ModifyCourses';
import GenerateContent from './components/GenerateContent';
import UploadFiles from './components/UploadFiles';
import ChatFeedback from './components/ChatFeedback';
import ContactSupport from './components/ContactSupport';
import FAQs from './components/FAQs';
import LiveAssistant from './components/LiveAssistant';
import TrainLiveTA from './components/TrainLiveTA';
import UserProfile from './components/UserProfile';

// Upload Files to GPT - GptAssistant.js
//import GptAssistant from './components/GptAssistant';

// Student Home Page:
import HomeStudent from './components/HomeStudent';
import AddCoursesStudent from './components/AddCoursesStudent';
import ChatFeedbackStudent from './components/ChatFeedbackStudent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />
        <Route path="/login-student" element={<LoginStudent />} />
        <Route path="/register-teacher" element={<RegisterTeacher/>} />
        <Route path="/register-student" element={<RegisterStudent/>} />
        <Route path="/register-confirmation" element={<RegistrationConfirmation/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/home-teacher" element={<HomeTeacher />} />
        <Route path="/add-courses" element={<AddCourses />} />
        <Route path="/add-courses-student" element={<AddCoursesStudent />} />
        <Route path="/modify-courses" element={<ModifyCourses />} />
        <Route path="/generate-content" element={<GenerateContent />} />
        <Route path="/upload-files" element={<UploadFiles />} />
        <Route path="/chat-feedback" element={<ChatFeedback />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/home-student" element={<HomeStudent />} />
        <Route path="/live-assistant" element={<LiveAssistant />} />
        <Route path="/train-ta" element={<TrainLiveTA />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/chat-feedback-student" element={<ChatFeedbackStudent />} />

        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
};

export default App;