import pandas as pd
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Resume, ParsedResume, JobRole, ResumeJobMatch
from .serializers import ResumeSerializer, ParsedResumeSerializer, JobRoleSerializer, ResumeJobMatchSerializer
from .nlp.parser import parse_resume
from .nlp.job_matcher import match_resume_to_jobs

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    
    @action(detail=True, methods=['post'])
    def parse(self, request, pk=None):
        resume = self.get_object()
        
        try:
            # Parse the resume
            parsed_resume = parse_resume(resume)
            
            # Match to job roles
            match_resume_to_jobs(parsed_resume)
            
            # Serialize the parsed data
            serializer = ParsedResumeSerializer(parsed_resume)
            return Response(serializer.data)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def export_to_excel(self, request):
        # Get all parsed resumes with their job matches
        parsed_resumes = ParsedResume.objects.all().prefetch_related('job_matches__job_role')
        
        # Create a list to hold all the data for Excel
        data = []
        
        for parsed_resume in parsed_resumes:
            # Get the top 3 job matches
            top_job_matches = parsed_resume.job_matches.all()[:3]
            
            # Basic resume data
            resume_data = {
                'Name': parsed_resume.name,
                'Email': parsed_resume.email,
                'Phone': parsed_resume.phone,
                'Skills': parsed_resume.skills,
                'Education': parsed_resume.education,
                'Experience': parsed_resume.experience,
            }
            
            # Add top job matches
            for i, match in enumerate(top_job_matches, 1):
                resume_data[f'Job Match {i}'] = match.job_role.name
                resume_data[f'Match Percentage {i}'] = f"{match.match_percentage}%"
            
            data.append(resume_data)
        
        # Create DataFrame and export to Excel
        df = pd.DataFrame(data)
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=parsed_resumes.xlsx'
        
        df.to_excel(response, index=False)
        return response

class ParsedResumeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ParsedResume.objects.all().prefetch_related('job_matches__job_role')
    serializer_class = ParsedResumeSerializer

class JobRoleViewSet(viewsets.ModelViewSet):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer