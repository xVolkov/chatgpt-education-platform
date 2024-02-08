import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles.css';

// Assuming a Modal component for course selection (you might need to implement this based on your UI framework)
// This is a placeholder and should be replaced with your actual modal implementation
const CourseSelectionModal = ({ isVisible, onClose, onCourseSelected }) => {
  // Placeholder for courses fetching
  const courses = [{ code: 'CS101', name: 'Introduction to Computer Science' }, { code: 'CS102', name: 'Data Structures' }];
  
  return isVisible ? (
    <div className="modal">
      <h2>Select a Course</h2>
      <select onChange={(e) => onCourseSelected(e.target.value)}>
        {courses.map(course => <option key={course.code} value={course.code}>{course.name}</option>)}
      </select>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
};

// Sidebar component to display chat history
const Sidebar = ({ chats, onSelectChat, onNewChat }) => {
  // The modal/popup can be implemented using a simple state to control visibility
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => setUploadModalVisible(false);

  const handleCourseSelected = (courseCode) => {
    // Here, implement the logic to fetch files for the selected course and upload them to OpenAI
    console.log('Selected course:', courseCode);
    // Close modal after selection
    closeUploadModal();
  };

  return (
    <div className="sidebar">
      <div className="chat-history">
        <div className="chat-history-text">Chat history</div>
        <button className="new-chat-button" onClick={onNewChat}>+</button>
      </div>
      {chats.map((chat, index) => (
        <div key={index} className="chat-preview" onClick={() => onSelectChat(chat)}>
          Chat {chat.id}
        </div>
      ))}
      <button className="upload-files-button" onClick={openUploadModal}>Upload Files</button>
      <CourseSelectionModal 
        isVisible={uploadModalVisible} 
        onClose={closeUploadModal} 
        onCourseSelected={handleCourseSelected} 
      />
    </div>
  );
};

// Chat window component to display current chat
const ChatWindow = ({ currentChat, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input); // Pass the input state to onSendMessage
      setInput('');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {currentChat.messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

// Main component
const LiveTA = () => {
  const [chats, setChats] = useState([{ id: 'default', messages: [] }, ]);
  const [currentChat, setCurrentChat] = useState(chats[0]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [currentChat.messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Adding user's message to the chat
    const userMessage = { sender: 'user', text: input };
    addMessageToChat(userMessage);

    try {
      const response = await axios.post('http://localhost:5000/chat-with-bot', { input });
      const botMessage = { sender: 'bot', text: response.data.response };
      addMessageToChat(botMessage);
    } catch (error) {
      console.error('Error sending message to bot:', error);
    }
    // Clear input field after sending the message
    setInput('');
  };

  const addMessageToChat = (message) => {
    setCurrentChat(current => ({
      ...current,
      messages: [...current.messages, message]
    }));

    setChats(chats => chats.map(chat => 
      chat.id === currentChat.id ? {...chat, messages: [...chat.messages, message]} : chat
    ));
  };

  const handleSelectChat = (selectedChat) => {
    setCurrentChat(selectedChat);
  };

  const handleCreateNewChat = () => {
    const newChatId = `chat_${chats.length + 1}`;
    const newChat = { id: newChatId, messages: [] };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

  return (
    <div className="live-ta">
      {/* Sidebar to display chat history */}
      <div className="sidebar">
        <div className="chat-history">
          <div className="chat-history-text">Chat history</div>
          <button className="new-chat-button" onClick={handleCreateNewChat}>+</button>
        </div>
        {chats.map((chat, index) => (
          <div key={index} className="chat-preview" onClick={() => handleSelectChat(chat)}>
            Chat {chat.id}
          </div>
        ))}
      </div>

      {/* Chat window to display the current chat */}
      <div className="chat-window">
        <div className="messages">
          {currentChat.messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>{message.text}</div>
          ))}
        </div>
        <div className="footer">
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTA;