// src/components/ResultDisplay.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultDisplay = ({ result }) => {
  if (!result || result.status !== 'success') return null;

  // Safely extract with fallback defaults ✅
  const {
    jd_saved = '',
    resume_saved = '',
    match_score = 0,
    jd_keywords = [],
    resume_keywords = [],
    matched_keywords = [],
    missed_keywords = [],
    resume_suggestions = [],
  } = result;

  const pieData = {
    labels: ['Matched', 'Missed'],
    datasets: [
      {
        data: [matched_keywords.length, missed_keywords.length],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-green-400">✅ Upload Successful</h2>
      <p><strong>JD:</strong> {jd_saved}</p>
      <p><strong>Resume:</strong> {resume_saved}</p>

      <h3 className="text-xl mt-4">
        🧠 Match Score: <span className="text-yellow-300 font-bold">{match_score}%</span>
      </h3>

      {/* Pie Chart */}
      <div className="max-w-xs mt-6">
        <Pie data={pieData} />
      </div>

      {/* Keywords Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* JD Keywords */}
        <div>
          <h4 className="text-lg font-semibold text-blue-300 mb-2">📌 JD Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {jd_keywords.map((word, i) => (
              <span key={i} className="bg-gray-700 px-3 py-1 rounded text-sm">{word}</span>
            ))}
          </div>
        </div>

        {/* Resume Keywords */}
        <div>
          <h4 className="text-lg font-semibold text-purple-300 mb-2">📄 Resume Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {resume_keywords.map((word, i) => (
              <span key={i} className="bg-gray-700 px-3 py-1 rounded text-sm">{word}</span>
            ))}
          </div>
        </div>

        {/* Matched Keywords */}
        <div>
          <h4 className="text-lg font-semibold text-green-300 mb-2">🔁 Matched Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {matched_keywords.length > 0 ? (
              matched_keywords.map((word, i) => (
                <span key={i} className="bg-green-600 px-3 py-1 rounded text-sm font-semibold">{word}</span>
              ))
            ) : (
              <p className="text-red-400 text-sm">No common keywords found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Missed JD Keywords */}
      {missed_keywords.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-red-400 mb-2">❌ Missed JD Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {missed_keywords.map((word, i) => (
              <span key={i} className="bg-red-600 px-3 py-1 rounded text-sm">{word}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {resume_suggestions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-orange-400 mb-2">📩 Suggestions to Improve Resume</h4>
          <ul className="list-disc list-inside text-sm text-white">
            {resume_suggestions.map((kw, idx) => (
              <li key={idx}>Try adding: <strong>{kw}</strong></li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ResultDisplay;
