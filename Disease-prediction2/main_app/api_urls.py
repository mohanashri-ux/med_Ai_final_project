from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import PatientViewSet, DoctorViewSet, ConsultationViewSet, RatingReviewViewSet, predict_disease

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'ratings', RatingReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', predict_disease, name='api_predict'),
]
