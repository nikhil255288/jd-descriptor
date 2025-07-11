import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from collections import Counter
import requests

# 📍 Set NLTK data path
nltk.data.path.append(os.path.join(os.path.dirname(__file__), 'nltk_data'))

# 🔁 NLTK setup
nltk.download('stopwords', download_dir=nltk.data.path[0])
stop_words = set(stopwords.words('english'))
tokenizer = RegexpTokenizer(r'\w+')

def extract_keywords(text, num_keywords=15):
    words = tokenizer.tokenize(text.lower())
    words = [word for word in words if word not in stop_words and len(word) > 2]
    freq = Counter(words)
    return [word for word, _ in freq.most_common(num_keywords)]

def extract_text(pdf_path):
    try:
        with fitz.open(pdf_path) as doc:
            return " ".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        return ""

def match_keywords_semantically(jd_keywords, resume_keywords, threshold=0.7):
    url = os.getenv("HF_MATCH_API")

    if not url:
        print("❌ HF_MATCH_API not set in environment variables")
        return []

    if not jd_keywords or not resume_keywords:
        return []

    payload = {
        "jd_keywords": jd_keywords,
        "resume_keywords": resume_keywords,
        "threshold": threshold
    }

    try:
        response = requests.post(url, json=payload, timeout=20)
        response.raise_for_status()
        return response.json().get("matched_keywords", [])
    except requests.exceptions.RequestException as e:
        print(f"❌ Error calling HF API: {e}")
        return []

app = Flask(__name__)

# ✅ Recommended CORS setup
CORS(app, resources={r"/upload": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({'message': '✅ JD Matcher backend running'})

@app.route('/upload', methods=['POST'])
def upload_files():
    try:
        jd_file = request.files.get('jd')
        resume_file = request.files.get('resume')

        if not jd_file or not resume_file:
            return jsonify({'status': 'error', 'message': 'Missing JD or Resume file'}), 400

        jd_path = os.path.join(UPLOAD_FOLDER, jd_file.filename)
        resume_path = os.path.join(UPLOAD_FOLDER, resume_file.filename)
        jd_file.save(jd_path)
        resume_file.save(resume_path)

        jd_text = extract_text(jd_path)
        resume_text = extract_text(resume_path)

        if not jd_text.strip() or not resume_text.strip():
            return jsonify({'status': 'error', 'message': 'One or both PDFs are unreadable or empty'}), 400

        jd_keywords = extract_keywords(jd_text)
        resume_keywords = extract_keywords(resume_text)

        matched_keywords = match_keywords_semantically(jd_keywords, resume_keywords)
        missed_keywords = list(set(jd_keywords) - set(matched_keywords))
        resume_suggestions = missed_keywords[:5]

        return jsonify({
            'status': 'success',
            'jd_saved': jd_file.filename,
            'resume_saved': resume_file.filename,
            'jd_keywords': jd_keywords,
            'resume_keywords': resume_keywords,
            'matched_keywords': matched_keywords,
            'missed_keywords': missed_keywords,
            'resume_suggestions': resume_suggestions,
            'jd_text': jd_text[:800],
            'resume_text': resume_text[:800]
        })

    except Exception as e:
        print(f"💥 Internal Server Error: {e}")
        return jsonify({'status': 'error', 'message': 'Internal Server Error', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
