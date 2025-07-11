# 🧠 JD Matcher – AI Resume & JD Comparison

A smart web app that compares a **Job Description (JD)** with a **Resume PDF** and gives you:

- 🔁 **Match Score** based on semantic similarity  
- 📌 **Extracted Keywords** from both JD & Resume  
- ✅ **Matched Keywords** & ❌ **Missed Keywords**  
- 💡 **AI Suggestions** to improve your resume  
- 📊 **Pie Chart** visualization of match results  

---

## 🛠️ Tech Stack

| Layer     | Tech                                     |
|-----------|------------------------------------------|
| Backend   | 🐍 Flask, PyMuPDF, SentenceTransformers   |
| Frontend  | ⚛️ React, TailwindCSS, Chart.js           |
| ML Model  | 🤖 `all-mpnet-base-v2` (SentenceTransformer) |

---

## 🚀 Getting Started – Run Locally

### 🔙 Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
