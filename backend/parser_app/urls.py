from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ParsedResumeViewSet, JobRoleViewSet

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet)
router.register(r'parsed-resumes', ParsedResumeViewSet)
router.register(r'job-roles', JobRoleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]