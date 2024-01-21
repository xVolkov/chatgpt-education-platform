import React, { useState } from 'react';

// Mock data for courses and chats
const coursesAndChats = {
  'CS101': ['Chat 1', 'Chat 2', 'Chat 3'],
  'MATH201': ['Chat 1', 'Chat 2'],
  // Add more courses and chats as needed
};

const ChatFeedback = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setSelectedChat(''); // Reset chat selection when changing course
  };

  const handleChatChange = (event) => {
    setSelectedChat(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    // Logic to submit the feedback
    console.log('Feedback submitted for', selectedCourse, selectedChat, feedback);
  };

  return (
    <div>
      <label>
        Select Course:
        <select value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {Object.keys(coursesAndChats).map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </label>

      {selectedCourse && (
        <label>
          Select Chat:
          <select value={selectedChat} onChange={handleChatChange}>
            <option value="">Select a chat</option>
            {coursesAndChats[selectedCourse].map(chat => (
              <option key={chat} value={chat}>{chat}</option>
            ))}
          </select>
        </label>
      )}

      {selectedChat && (
        <div>
          <label>
            Feedback:
            <textarea value={feedback} onChange={handleFeedbackChange} />
          </label>
        </div>
      )}

      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
};

export default ChatFeedback;
