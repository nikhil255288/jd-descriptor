// src/pages/Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    try {
      const res = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <form className="upload-form" onSubmit={handleUpload}>
        <label>Upload JD (PDF):</label>
        <input type="file" name="jd" required />
        <label>Upload Resume (PDF):</label>
        <input type="file" name="resume" required />
        <button type="submit">Upload</button>
      </form>

      {error && <p className="error">❌ {error}</p>}

      {response && (
        <div className="results">
          <h2>✅ Upload Successful</h2>
          <p><strong>JD:</strong> {response.jd_saved}</p>
          <p><strong>Resume:</strong> {response.resume_saved}</p>
          <h3>🧠 Match Score: {response.match_score}%</h3>

          <div>
            <h3>📌 JD Keywords:</h3>
            <div className="keyword-box">
              {response.jd_keywords.map((kw, i) => (
                <span key={i} className={response.matched_keywords.includes(kw) ? 'highlight' : ''}>{kw}</span>
              ))}
            </div>
          </div>

          <div>
            <h3>📄 Resume Keywords:</h3>
            <div className="keyword-box">
              {response.resume_keywords.map((kw, i) => (
                <span key={i} className={response.matched_keywords.includes(kw) ? 'highlight' : ''}>{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
