import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles.css';

// Main component
const LiveTA = () => {
  const [chats, setChats] = useState([{ id: 'default', messages: [] }, ]);
  const [currentChat, setCurrentChat] = useState(chats[0]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const courses = [{ code: 'CS101', name: 'Introduction to Computer Science' }, { code: 'CS102', name: 'Data Structures' }];

  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => setUploadModalVisible(false);

  // Function to upload selected files to the OpenAI API
  const handleFilesUpload = async (courseCode, files) => {
    const formData = new FormData();
    formData.append('courseCode', courseCode); // Append course code to the form data
    Array.from(files).forEach(file => { // Append each file to the form data
      formData.append('file', file);
    });
    try {
      const response = await axios.post('http://localhost:5000/chatbot-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Files uploaded and processed by chatbot:', response.data.responses);

      const botMessage = { sender: 'bot', text: response.data.response };
      addMessageToChat(botMessage);
      
    } catch (error) {
      console.error('Error uploading files to chatbot:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    openUploadModal(); // Open modal after files are selected
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFiles(event.dataTransfer.files);
    openUploadModal(); // Open modal after files are dropped
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const chatWindow = document.querySelector('.chat-window');
    chatWindow.addEventListener('dragover', handleDragOver);
    chatWindow.addEventListener('drop', handleDrop);
    return () => {
      chatWindow.removeEventListener('dragover', handleDragOver);
      chatWindow.removeEventListener('drop', handleDrop);
    };
  }, []);

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