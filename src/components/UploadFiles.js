import React, { useState } from 'react';

const UploadFiles = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileDirectory, setFileDirectory] = useState('');
  const [filePermissions, setFilePermissions] = useState('');

  const handleFileUpload = (event) => {
    // Logic to handle file upload
  };

  return (
    <div className="upload-files-form">
      <h1>Course Files Upload Portal</h1>
      <form onSubmit={handleFileUpload}>
        <label>
          Select a Course:
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {/* Options */}
          </select>
        </label>
        <label>
          File Type:
          <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
            {/* Options */}
          </select>
        </label>
        <label>
          File Directory:
          <select value={fileDirectory} onChange={(e) => setFileDirectory(e.target.value)}>
            {/* Options */}
          </select>
        </label>
        <label>
          File Permissions:
          <select value={filePermissions} onChange={(e) => setFilePermissions(e.target.value)}>
            {/* Options */}
          </select>
        </label>
        <input type="file" multiple />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadFiles;
