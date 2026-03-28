
#chats/urls.py
from django.urls import path , include
from . import views
from chats.views import ai_chat

urlpatterns = [

  path('post_feedback', views.post_feedback, name='post_feedback'),
  path('get_feedback', views.get_feedback, name='get_feedback'),
  path('ai_chat/', ai_chat, name='ai_chat')
   
]