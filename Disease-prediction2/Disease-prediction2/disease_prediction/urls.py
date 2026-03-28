from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from chats.views import ai_chat

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main_app.urls')),  # Assuming main_app is your main app
    path('accounts/', include('accounts.urls')),
    path('chats/', include('chats.urls')),
    path('medicine/', include('medicine.urls')),  # Include medicine URLs
    path('ai_chat', ai_chat, name='ai_chat')
]
