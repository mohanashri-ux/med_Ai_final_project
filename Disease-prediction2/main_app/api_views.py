from rest_framework import viewsets, status, permissions
import os
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from .models import patient, doctor, diseaseinfo, consultation, rating_review
from .serializers import PatientSerializer, DoctorSerializer, DiseaseInfoSerializer, ConsultationSerializer, RatingReviewSerializer
from django.contrib.auth.models import User
import joblib as jb
from datetime import date

# Load model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'trained_model')
try:
    model = jb.load(MODEL_PATH)
except:
    model = None

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def predict_disease(request):
    s_list = ['itching','skin_rash','nodal_skin_eruptions','continuous_sneezing','shivering','chills','joint_pain',
    'stomach_pain','acidity','ulcers_on_tongue','muscle_wasting','vomiting','burning_micturition','spotting_ urination',
    'fatigue','weight_gain','anxiety','cold_hands_and_feets','mood_swings','weight_loss','restlessness','lethargy',
    'patches_in_throat','irregular_sugar_level','cough','high_fever','sunken_eyes','breathlessness','sweating',
    'dehydration','indigestion','headache','yellowish_skin','dark_urine','nausea','loss_of_appetite','pain_behind_the_eyes',
    'back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine',
    'yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
    'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation',
    'redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs',
    'fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool',
    'irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs',
    'swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails',
    'swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips',
    'slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints',
    'movement_stiffness','spinning_movements','loss_of_balance','unsteadiness',
    'weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine',
    'continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)',
    'depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain',
    'abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria','family_history','mucoid_sputum',
    'rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion',
    'receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen',
    'history_of_alcohol_consumption','fluid_overload','blood_in_sputum','prominent_veins_on_calf',
    'palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling',
    'silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose',
    'yellow_crust_ooze',]

    psymptoms = request.data.get("symptoms", [])
    if not psymptoms:
        return Response({'error': 'No symptoms provided'}, status=status.HTTP_400_BAD_REQUEST)

    testingsymptoms = [0] * len(s_list)
    for k in range(len(s_list)):
        if s_list[k] in psymptoms:
            testingsymptoms[k] = 1

    if model:
        inputtest = [testingsymptoms]
        predicted = model.predict(inputtest)
        y_pred_2 = model.predict_proba(inputtest)
        confidencescore = y_pred_2.max() * 100
        predicted_disease = predicted[0]
        
        # Consultant logic
        specialization_map = {
            'Rheumatologist': ['Osteoarthristis', 'Arthritis'],
            'Cardiologist': ['Heart attack', 'Bronchial Asthma', 'Hypertension '],
            'ENT specialist': ['(vertigo) Paroymsal Positional Vertigo', 'Hypothyroidism'],
            'Neurologist': ['Varicose veins', 'Paralysis (brain hemorrhage)', 'Migraine', 'Cervical spondylosis'],
            'Allergist/Immunologist': ['Allergy', 'Pneumonia', 'AIDS', 'Common Cold', 'Tuberculosis', 'Malaria', 'Dengue', 'Typhoid'],
            'Urologist': ['Urinary tract infection', 'Dimorphic hemmorhoids(piles)'],
            'Dermatologist': ['Acne', 'Chicken pox', 'Fungal infection', 'Psoriasis', 'Impetigo'],
            'Gastroenterologist': ['Peptic ulcer diseae', 'GERD', 'Chronic cholestasis', 'Drug Reaction', 'Gastroenteritis', 'Hepatitis E', 'Alcoholic hepatitis', 'Jaundice', 'hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Diabetes ', 'Hypoglycemia']
        }
        
        consultdoctor = "other"
        for spec, diseases in specialization_map.items():
            if predicted_disease in diseases:
                consultdoctor = spec
                break
        
        # Save info
        try:
            p = patient.objects.get(user=request.user)
            dinfo = diseaseinfo.objects.create(
                patient=p,
                diseasename=predicted_disease,
                no_of_symp=len(psymptoms),
                symptomsname=psymptoms,
                confidence=confidencescore,
                consultdoctor=consultdoctor
            )
            return Response({
                'id': dinfo.id,
                'predicted_disease': predicted_disease,
                'confidence': f"{confidencescore:.0f}",
                'consult_doctor': consultdoctor
            })
        except patient.DoesNotExist:
            return Response({'error': 'Patient profile required for prediction.'}, status=status.HTTP_403_FORBIDDEN)
    
    return Response({'error': 'Model not loaded'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users should only see their own profile, unless they are admin
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(user=user)

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Anyone can see all doctors (e.g. for selection), but only the doctor can edit their own
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()] # You could add a custom IsOwner permission here
        return [permissions.IsAuthenticated()]

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        # Patients see their consultations, doctors see theirs
        if hasattr(user, 'patient'):
            return self.queryset.filter(patient__user=user)
        if hasattr(user, 'doctor'):
            return self.queryset.filter(doctor__user=user)
        return self.queryset.none()

    def perform_create(self, serializer):
        try:
            p = patient.objects.get(user=self.request.user)
            serializer.save(patient=p, consultation_date=date.today(), status="active")
        except patient.DoesNotExist:
            raise serializers.ValidationError({"error": "Only patients can create consultations."})

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        consultation_obj = self.get_object()
        # Verify ownership before closing
        if consultation_obj.patient.user != request.user and consultation_obj.doctor.user != request.user:
             return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
             
        consultation_obj.status = "closed"
        consultation_obj.save()
        return Response({'status': 'consultation closed'})

class RatingReviewViewSet(viewsets.ModelViewSet):
    queryset = rating_review.objects.all()
    serializer_class = RatingReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        # See ratings they gave or (if doctor) ratings they received
        if hasattr(user, 'patient'):
            return self.queryset.filter(patient__user=user)
        if hasattr(user, 'doctor'):
            return self.queryset.filter(doctor__user=user)
        return self.queryset.none()

    def perform_create(self, serializer):
        try:
            p = patient.objects.get(user=self.request.user)
            serializer.save(patient=p)
        except patient.DoesNotExist:
           raise serializers.ValidationError({"error": "Only patients can submit reviews."})
