import re
import os
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.chunk import ne_chunk
from nltk.tag import pos_tag
import docx
import PyPDF2
from ..models import ParsedResume

# Ensure NLTK data is downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('taggers/averaged_perceptron_tagger')
    nltk.data.find('chunkers/maxent_ne_chunker')
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')
    nltk.download('maxent_ne_chunker')
    nltk.download('words')
    nltk.download('stopwords')

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return " ".join([paragraph.text for paragraph in doc.paragraphs])

def extract_text(file_path):
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension.lower() == '.pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension.lower() == '.docx':
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")

def extract_name(text):
    sentences = sent_tokenize(text)
    # Assume the name is in the first few sentences
    for sentence in sentences[:3]:
        tokens = word_tokenize(sentence)
        tagged = pos_tag(tokens)
        entities = ne_chunk(tagged)
        
        for entity in entities:
            if hasattr(entity, 'label') and entity.label() == 'PERSON':
                return ' '.join([child[0] for child in entity])
    
    # Fallback: try to find a name using common patterns
    name_patterns = [
        r'^([A-Z][a-z]+ [A-Z][a-z]+)',  # First Last at beginning of text
        r'^Name:? ([A-Z][a-z]+ [A-Z][a-z]+)',  # "Name: First Last"
        r'^([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)',  # First M. Last at beginning
    ]
    
    for pattern in name_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    
    return None

def extract_email(text):
    email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_regex, text)
    if match:
        return match.group()
    return None

def extract_phone(text):
    # Simple phone number pattern
    phone_regex = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    match = re.search(phone_regex, text)
    if match:
        return match.group()
    return None

def extract_skills(text, common_skills=None):
    if common_skills is None:
        # This is a simple list - you can expand or refine this based on your needs
        common_skills = [
            "python", "java", "javascript", "c++", "c#", "ruby", "php", "sql", 
            "html", "css", "react", "angular", "vue", "django", "flask", "spring", 
            "node", "express", "mongodb", "mysql", "postgresql", "firebase",
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git",
            "machine learning", "data science", "artificial intelligence", "nlp",
            "communication", "teamwork", "leadership", "problem solving", "creativity"
        ]
    
    skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if skill.lower() in text_lower:
            # Check if it's a standalone word
            skill_pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(skill_pattern, text_lower):
                skills.append(skill)
    
    return list(set(skills))  # Remove duplicates

def extract_education(text):
    education_keywords = ["degree", "university", "college", "bachelor", "master", "phd", "diploma"]
    education_sections = []
    
    # Find sentences that might contain education information
    sentences = sent_tokenize(text)
    for sent in sentences:
        for keyword in education_keywords:
            if keyword.lower() in sent.lower():
                education_sections.append(sent)
                break
    
    return "\n".join(education_sections) if education_sections else None

def extract_experience(text):
    experience_keywords = ["experience", "work", "job", "position", "role", "employment"]
    experience_sections = []
    
    # Find sentences that might contain experience information
    sentences = sent_tokenize(text)
    for sent in sentences:
        for keyword in experience_keywords:
            if keyword.lower() in sent.lower():
                experience_sections.append(sent)
                break
    
    return "\n".join(experience_sections) if experience_sections else None

def parse_resume(resume_instance):
    # Get the file path
    file_path = resume_instance.file.path
    
    # Extract text based on file type
    text = extract_text(file_path)
    
    # Extract information
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)
    education = extract_education(text)
    experience = extract_experience(text)
    
    # Create or update ParsedResume instance
    parsed_resume, created = ParsedResume.objects.update_or_create(
        resume=resume_instance,
        defaults={
            'name': name,
            'email': email,
            'phone': phone,
            'skills': ", ".join(skills) if skills else None,
            'education': education,
            'experience': experience,
        }
    )
    
    return parsed_resume