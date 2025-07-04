# 🧠 JD Matcher – AI Resume & JD Comparison

This project compares a Job Description PDF with a Resume PDF and gives:
- 🔁 Match Score
- 📌 JD & Resume Keywords
- ✅ Matched + ❌ Missed Keywords
- 📊 Suggestions for resume improvement

## 🛠 Tech Stack

- 🐍 Flask (Python Backend)
- ⚛️ React (Frontend)
- 🤖 SentenceTransformers: `all-mpnet-base-v2`
- 📄 PDF Parsing: PyMuPDF

## 🚀 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
