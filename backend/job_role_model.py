import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load NLP Model
nlp = spacy.load("en_core_web_sm")

# Predefined Job Roles with Required Skills
job_roles = {
    "Software Engineer": ["Python", "Java", "C++", "SQL", "Git", "Data Structures", "Algorithms"],
    "Data Scientist": ["Python", "Machine Learning", "Deep Learning", "Pandas", "TensorFlow", "SQL"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "UI/UX", "Bootstrap"],
    "Backend Developer": ["Node.js", "Django", "Flask", "Databases", "MongoDB", "REST APIs"],
    "Cloud Engineer": ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "DevOps"],
}

def preprocess_text(text):
    """Basic text preprocessing."""
    if not text:  # Ensure text is not empty
        return ""
    doc = nlp(text.lower())
    return " ".join([token.lemma_ for token in doc if not token.is_stop and not token.is_punct])

def suggest_job_role(resume_text, extracted_skills):
    """Suggests a job role based on extracted resume text and skills."""
    if not resume_text and not extracted_skills:
        return "Unknown"

    job_roles_texts = [" ".join(skills) for skills in job_roles.values()]
    all_texts = [preprocess_text(resume_text)] + job_roles_texts

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    best_match_index = np.argmax(similarity_scores)

    suggested_role = list(job_roles.keys())[best_match_index]
    
    print(f"📌 Suggested Job Role: {suggested_role}")  # ✅ Debugging

    return suggested_role

# Example Usage
if __name__ == "__main__":
    resume_text = "Experienced in Python, Machine Learning, and Data Science projects using TensorFlow and Pandas."
    extracted_skills = ["Python", "Machine Learning", "TensorFlow", "Pandas"]
    job_suggestion = suggest_job_role(resume_text, extracted_skills)
    print(f"Suggested Job Role: {job_suggestion}")
