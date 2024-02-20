import React, { useState, useEffect, useRef } from 'react';

const LiveAssistant = () => {
  const [action, setAction] = useState('');
  const [userFile, setUserFile] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState(''); // State to hold the response
  const [ws, setWs] = useState(null);
  const [chatLog, setChatLog] = useState({});

  const fileInputRef = useRef(null); // Use useRef hook to create a ref for your file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    setWs(websocket);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setResponse(message.message); // Assuming the server sends back a JSON with a 'message' field
      logMessages(response)
    };
    return () => {
      websocket.close();
    };
  }, []);

  // #################### LOGS MESSAGES ####################
  const logMessages = (message) =>{
    setChatLog(message);
  }

  // #################### Handles Sending a Question ####################
  const handleAskQuestion = () => {
    if (ws) {
      ws.send(JSON.stringify({
        action: "1",
        userQuestion: userQuestion,
        userFile: "null"
      }));
    }
    logMessages(userQuestion);
    setUserQuestion('');
  };

  // #################### Handles Uploading Files to Assistant ####################
  const handleUploadToAssistant = (fileName) => {
    const act = "2";
    const question = "null";

    if (ws) {
      ws.send(JSON.stringify({
        action: act,
        userQuestion: question,
        userFile: fileName
      }));
    }
    logMessages(userQuestion);
    setSelectedFile(null);
    fileInputRef.current.value = '';
  };

  // #################### HANDLES THE FILE UPLOAD LOGIC ####################
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:3002/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Upload failed');
    }
    alert(selectedFile.name)
    const fileName = selectedFile.name
    handleUploadToAssistant(fileName)
  };


  return (
    <div>
      <h1>Live Assistant</h1>
      <h2>Ask a Question or Upload File to Assistant</h2>
        <textarea readOnly value={response} style={{ width: '100%', height: '200px' }}></textarea>
        <div>
          <input
            type='text'
            placeholder="Type your question here"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
          />
          <button onClick={handleAskQuestion}>Send</button>
        </div>
        <h2>Select a File to Upload</h2>
        <div>
          <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
          <button onClick={handleUpload}>Upload</button>
        </div>

    </div>
  );
};

export default LiveAssistant;
