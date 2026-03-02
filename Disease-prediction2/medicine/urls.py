from django.urls import path
from . import views

urlpatterns = [
    path('', views.medicine_page, name='medicine_page'),  # This should match the URL /medicine/
    path('searchdrug/', views.medicine_search, name='medicine_search')    # Add other paths as needed
]
