from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ChatViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'messages', ChatViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
