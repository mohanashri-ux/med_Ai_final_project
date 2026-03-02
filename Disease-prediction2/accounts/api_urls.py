from django.urls import path
from .api_views import register_patient, register_doctor, get_user_profile

urlpatterns = [
    path('register/patient/', register_patient, name='api_register_patient'),
    path('register/doctor/', register_doctor, name='api_register_doctor'),
    path('profile/', get_user_profile, name='api_profile'),
]
