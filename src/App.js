// Import necessary libraries
import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Assuming you create a CSS file for styling

// Get the server port from environment variables or default to 8080
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || "localhost";
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 8080;
const API_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}/api/v1`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage("");
    setUploadMessage("");
  };

  // Upload file to the server
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          `Error ${error.response.status}: ${error.response.data.message}`
        );
      } else {
        setErrorMessage("An unexpected error occurred while uploading.");
      }
    }
  };

  // Download file from the server
  const handleFileDownload = async () => {
    if (!downloadFileName) {
      setErrorMessage("Please enter a file name to download.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/download/${downloadFileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          `Error ${error.response.status}: ${
            error.response.data.message || "Failed to download file."
          }`
        );
      } else {
        setErrorMessage("An unexpected error occurred while downloading.");
      }
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">File Upload and Download</h1>

      {/* File Upload Section */}
      <div className="section">
        <h2 className="section-title">Upload File</h2>
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleFileUpload} className="button">
          Upload
        </button>
        {uploadMessage && <p className="success-message">{uploadMessage}</p>}
      </div>

      {/* File Download Section */}
      <div className="section">
        <h2 className="section-title">Download File</h2>
        <input
          type="text"
          placeholder="Enter file name"
          value={downloadFileName}
          onChange={(e) => setDownloadFileName(e.target.value)}
          className="text-input"
        />
        <button onClick={handleFileDownload} className="button">
          Download
        </button>
      </div>

      {/* Error Message Section */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default App;
