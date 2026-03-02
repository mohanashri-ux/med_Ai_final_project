from django.urls import path
from .api_views import search_medicine

urlpatterns = [
    path('search/', search_medicine, name='api_medicine_search'),
]
