import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import UploadForm from './components/UploadForm';
import ResultDisplay from './components/ResultDisplay';
import { motion } from 'framer-motion';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('upload'); // NEW: Controls current view

  const handleUploadStart = () => {
    setResult(null);
    setLoading(true);
    setView('upload');
  };

  const handleUploadSuccess = (data) => {
    setResult(data);
    setLoading(false);
    setView('results'); // Show results after success
  };

  const handleUploadError = () => {
    setLoading(false);
    alert('❌ Upload failed. Try again!');
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar with view setter */}
      <Sidebar setView={setView} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {view === 'upload' && (
          <section id="upload" className="mb-12">
            <h1 className="text-3xl font-bold text-blue-300 mb-6">📤 Upload JD & Resume</h1>
            <UploadForm
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            {loading && <p className="text-yellow-400 mt-4">🔄 Matching in progress...</p>}
          </section>
        )}

        {view === 'results' && result?.status === 'success' && (
          <motion.section
            id="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6"
          >
            <ResultDisplay result={result} />
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default App;
