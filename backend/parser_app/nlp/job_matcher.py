from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ..models import ParsedResume, JobRole, ResumeJobMatch

def calculate_skill_similarity(resume_skills, job_skills):
    if not resume_skills or not job_skills:
        return 0
    
    resume_skills_list = [skill.strip().lower() for skill in resume_skills.split(',')]
    job_skills_list = [skill.strip().lower() for skill in job_skills.split(',')]
    
    # Convert to sets for intersection calculation
    resume_skills_set = set(resume_skills_list)
    job_skills_set = set(job_skills_list)
    
    # Calculate Jaccard similarity (intersection over union)
    intersection = len(resume_skills_set.intersection(job_skills_set))
    union = len(resume_skills_set.union(job_skills_set))
    
    return (intersection / union) if union > 0 else 0

def calculate_text_similarity(text1, text2):
    if not text1 or not text2:
        return 0
    
    # Create a CountVectorizer to convert texts to vectors
    vectorizer = CountVectorizer().fit_transform([text1, text2])
    vectors = vectorizer.toarray()
    
    # Calculate cosine similarity
    return cosine_similarity(vectors)[0, 1]

def match_resume_to_jobs(parsed_resume):
    job_roles = JobRole.objects.all()
    
    for job_role in job_roles:
        # Calculate skill similarity
        skill_similarity = calculate_skill_similarity(parsed_resume.skills, job_role.required_skills)
        
        # Calculate experience similarity
        exp_similarity = calculate_text_similarity(parsed_resume.experience, job_role.description)
        
        # Calculate overall match percentage (you can adjust the weights)
        match_percentage = (skill_similarity * 0.7 + exp_similarity * 0.3) * 100
        
        # Create or update the match record
        ResumeJobMatch.objects.update_or_create(
            parsed_resume=parsed_resume,
            job_role=job_role,
            defaults={'match_percentage': round(match_percentage, 2)}
        )
    
    return parsed_resume.job_matches.all()