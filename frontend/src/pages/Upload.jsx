import React, { useState } from "react";
import { uploadFiles } from "../services/api";

const Upload = () => {
  const [jd, setJd] = useState(null);
  const [resume, setResume] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jd || !resume) {
      alert("Please upload both files.");
      return;
    }

    try {
      const data = await uploadFiles(jd, resume);
      setResponse(data);
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Upload JD & Resume</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Description (PDF):</label>
          <input type="file" accept=".pdf" onChange={(e) => setJd(e.target.files[0])} />
        </div>
        <br />
        <div>
          <label>Resume (PDF):</label>
          <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>

     {response && (
  <div style={{ marginTop: "2rem" }}>
    <h3 style={{ color: "green" }}>✅ Upload Successful</h3>
    <p><strong>JD:</strong> {response.jd_saved}</p>
    <p><strong>Resume:</strong> {response.resume_saved}</p>
    <p style={{ color: response.match_score > 75 ? 'green' : 'orange' }}>
      <strong>🧠 Match Score:</strong> {response.match_score}%
    </p>
  </div>
)}


    </div>
  );
};

export default Upload;
