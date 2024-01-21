import React, { useState } from 'react';
import './LiveTA.css'; // Make sure to create and style your CSS file accordingly

// Sidebar component to display chat history
const Sidebar = ({ chats, onSelectChat }) => {
  return (
    <div className="sidebar">
      {chats.map((chat, index) => (
        <div key={index} className="chat-preview" onClick={() => onSelectChat(chat)}>
          Chat {chat.id}
        </div>
      ))}
    </div>
  );
};

// Chat window component to display current chat
const ChatWindow = ({ currentChat, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
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
  );
};

// Main component
const LiveTA = () => {
  const [chats, setChats] = useState([
    { id: 'default', messages: [] }, // Start with a default chat
  ]);
  const [currentChat, setCurrentChat] = useState(chats[0]);

  const handleSelectChat = (selectedChat) => {
    setCurrentChat(selectedChat);
  };

  const handleSendMessage = (text) => {
    const newMessage = { text, sender: 'user' };
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
    };
    setCurrentChat(updatedChat); // Update current chat with new message

    // Update the chat in the chat history
    setChats(chats.map(chat => chat.id === currentChat.id ? updatedChat : chat));
  };

  const handleCreateNewChat = () => {
    const newChatId = `chat_${chats.length + 1}`;
    const newChat = { id: newChatId, messages: [] };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

  return (
    <div className="live-ta">
      <Sidebar chats={chats} onSelectChat={handleSelectChat} />
      <div className="main-content">
        <button className="new-chat-button" onClick={handleCreateNewChat}>Create New Chat</button>
        {currentChat && <ChatWindow currentChat={currentChat} onSendMessage={handleSendMessage} />}
      </div>
    </div>
  );
};

export default LiveTA;
