from rest_framework import serializers
from django.contrib.auth.models import User
from .models import patient, doctor, diseaseinfo, consultation, rating_review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = doctor
        fields = '__all__'

class DiseaseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = diseaseinfo
        fields = '__all__'

class ConsultationSerializer(serializers.ModelSerializer):
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=doctor.objects.all(), source='doctor', write_only=True)
    diseaseinfo_id = serializers.PrimaryKeyRelatedField(queryset=diseaseinfo.objects.all(), source='diseaseinfo', write_only=True)
    
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    diseaseinfo = DiseaseInfoSerializer(read_only=True)
    
    class Meta:
        model = consultation
        fields = ['id', 'patient', 'doctor', 'diseaseinfo', 'consultation_date', 'status', 'doctor_id', 'diseaseinfo_id']
        read_only_fields = ['consultation_date', 'status']

class RatingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = rating_review
        fields = '__all__'
