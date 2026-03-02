from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/main/', include('main_app.api_urls')),
    path('api/chats/', include('chats.api_urls')),
    path('api/accounts/', include('accounts.api_urls')),
    path('api/medicine/', include('medicine.api_urls')),
    path('', include('main_app.urls')),
    path('accounts/', include('accounts.urls')),
    path('chats/', include('chats.urls')),
    path('medicine/', include('medicine.urls')),
]
