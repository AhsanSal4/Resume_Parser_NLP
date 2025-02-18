from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Resume {self.id}"

class ParsedResume(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='parsed_data')
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Parsed data for {self.resume}"

class JobRole(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.TextField()
    
    def __str__(self):
        return self.name

class ResumeJobMatch(models.Model):
    parsed_resume = models.ForeignKey(ParsedResume, on_delete=models.CASCADE, related_name='job_matches')
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    match_percentage = models.FloatField()
    
    class Meta:
        ordering = ['-match_percentage']
    
    def __str__(self):
        return f"{self.parsed_resume.name} - {self.job_role.name} ({self.match_percentage}%)"