import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from collections import Counter
import torch

# 📍 Set NLTK data path (your local nltk folder)
os.environ['NLTK_DATA'] = 'C:/Users/nikhi/AppData/Roaming/nltk_data'

# 🔁 NLTK setup
stop_words = set(stopwords.words('english'))
tokenizer = RegexpTokenizer(r'\w+')

# 🔑 Extract top keywords from text
def extract_keywords(text, num_keywords=15):
    words = tokenizer.tokenize(text.lower())
    words = [word for word in words if word not in stop_words and len(word) > 2]
    freq = Counter(words)
    return [word for word, _ in freq.most_common(num_keywords)]

# 📄 Extract full text from PDF
def extract_text(pdf_path):
    try:
        with fitz.open(pdf_path) as doc:
            return " ".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        return ""

# 🔁 Semantic Keyword Matching
def match_keywords_semantically(jd_keywords, resume_keywords, threshold=0.7):
    jd_embeddings = model.encode(jd_keywords, convert_to_tensor=True)
    resume_embeddings = model.encode(resume_keywords, convert_to_tensor=True)

    matched = []
    for i, jd_word in enumerate(jd_keywords):
        similarities = util.cos_sim(jd_embeddings[i], resume_embeddings)[0]
        max_score = torch.max(similarities).item()
        if max_score >= threshold:
            matched.append(jd_word)
    return matched

# 🚀 Flask App Setup
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 🔥 Transformer model
model = SentenceTransformer('all-mpnet-base-v2')

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

        # Save uploaded PDFs
        jd_path = os.path.join(UPLOAD_FOLDER, jd_file.filename)
        resume_path = os.path.join(UPLOAD_FOLDER, resume_file.filename)
        jd_file.save(jd_path)
        resume_file.save(resume_path)

        # Extract text from PDFs
        jd_text = extract_text(jd_path)
        resume_text = extract_text(resume_path)

        if not jd_text.strip() or not resume_text.strip():
            return jsonify({'status': 'error', 'message': 'One or both PDFs are unreadable or empty'}), 400

        # Match score (document-level)
        jd_embed = model.encode([jd_text])
        resume_embed = model.encode([resume_text])
        similarity = cosine_similarity(jd_embed, resume_embed)[0][0]
        match_score = round(similarity * 100, 2)

        # Keyword-based matching
        jd_keywords = extract_keywords(jd_text)
        resume_keywords = extract_keywords(resume_text)

        matched_keywords = match_keywords_semantically(jd_keywords, resume_keywords)
        missed_keywords = list(set(jd_keywords) - set(matched_keywords))
        resume_suggestions = missed_keywords[:5]  # Top 5 suggestions

        # Log to server console
        print(f"\n📥 JD: {jd_file.filename}")
        print(f"📥 Resume: {resume_file.filename}")
        print(f"✅ Match Score: {match_score}%")
        print(f"🔁 Matched Keywords: {matched_keywords}")
        print(f"❌ Missed Keywords: {missed_keywords}\n")

        return jsonify({
            'status': 'success',
            'jd_saved': jd_file.filename,
            'resume_saved': resume_file.filename,
            'match_score': match_score,
            'jd_keywords': jd_keywords,
            'resume_keywords': resume_keywords,
            'matched_keywords': matched_keywords,
            'missed_keywords': missed_keywords,
            'resume_suggestions': resume_suggestions,
            'jd_text': jd_text[:800],  # For debugging, optional
            'resume_text': resume_text[:800]
        })

    except Exception as e:
        print(f"💥 Internal Server Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
