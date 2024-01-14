import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginTeacher from './LoginTeacher';
import LoginStudent from './LoginStudent';

const LoginRegister = () => {
  const [loginType, setLoginType] = useState(null); // 'teacher' or 'student'
  const navigate = useNavigate();

  const handleLoginType = (type) => {
    setLoginType(type);
    navigate(type === 'teacher' ? '/login-teacher' : '/login-student');
  };

  return (
    <div className="login-register-container">
      <h1>Welcome to SmartLearnAI!</h1>
      <div className="login-buttons">
        <button onClick={() => handleLoginType('teacher')}>Login/Register as Teacher</button>
        <button onClick={() => handleLoginType('student')}>Login/Register as Student</button>
      </div>
      {loginType === 'teacher' && <LoginTeacher />}
      {loginType === 'student' && <LoginStudent />}
    </div>
  );
};

export default LoginRegister;
