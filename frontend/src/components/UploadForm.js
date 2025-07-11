// src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = ({ onUploadStart, onUploadSuccess, onUploadError }) => {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdFile || !resumeFile) return;

    const formData = new FormData();
    formData.append('jd', jdFile);
    formData.append('resume', resumeFile);

    setLoading(true);
    onUploadStart(); // Notify parent upload started

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onUploadSuccess(data); // Notify parent of success
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error("Upload error:", err);
      onUploadError(err); // Notify parent of failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-2">Job Description (PDF):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setJdFile(e.target.files[0])}
          required
          className="block w-full bg-gray-800 text-white file:bg-blue-600 file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
        />
      </div>

      <div>
        <label className="block mb-2">Resume (PDF):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          required
          className="block w-full bg-gray-800 text-white file:bg-blue-600 file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {loading && <p className="text-yellow-400 mt-2">🔄 Uploading & matching...</p>}
    </form>
  );
};

export default UploadForm;
