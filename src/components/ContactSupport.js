import React, { useState } from 'react';

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
  );
};

export default ContactSupport;
