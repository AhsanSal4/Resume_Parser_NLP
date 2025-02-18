from rest_framework import serializers
from .models import Resume, ParsedResume, JobRole, ResumeJobMatch

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'uploaded_at']

class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = ['id', 'name', 'description', 'required_skills']

class ResumeJobMatchSerializer(serializers.ModelSerializer):
    job_role = JobRoleSerializer(read_only=True)
    
    class Meta:
        model = ResumeJobMatch
        fields = ['id', 'job_role', 'match_percentage']

class ParsedResumeSerializer(serializers.ModelSerializer):
    job_matches = ResumeJobMatchSerializer(many=True, read_only=True)
    
    class Meta:
        model = ParsedResume
        fields = ['id', 'name', 'email', 'phone', 'skills', 'education', 'experience', 'job_matches']