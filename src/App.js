import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import LoginTeacher from './components/LoginTeacher';
import LoginStudent from './components/LoginStudent';
import RegisterTeacher from './components/RegisterTeacher';
import RegisterStudent from './components/RegisterStudent';
import RegistrationConfirmation from './components/RegisterConfirmation';
import ForgotPassword from './components/ForgotPassword';
import HomeTeacher from './components/HomeTeacher';
import './styles.css';

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
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  );
};

export default App;