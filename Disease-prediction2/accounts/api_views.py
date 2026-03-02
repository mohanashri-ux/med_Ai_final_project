from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from main_app.models import patient, doctor

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_patient(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data.get('email', '')
        )
        
        patient.objects.create(
            user=user,
            name=data['name'],
            dob=data['dob'],
            gender=data['gender'],
            address=data['address'],
            mobile_no=data['mobile']
        )
        return Response({'message': 'Patient registered successfully'}, status=status.HTTP_201_CREATED)
    except KeyError as e:
        return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_doctor(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data.get('email', '')
        )
        
        doctor.objects.create(
            user=user,
            name=data['name'],
            dob=data['dob'],
            gender=data['gender'],
            address=data['address'],
            mobile_no=data['mobile'],
            registration_no=data['registration_no'],
            year_of_registration=data['year_of_registration'],
            qualification=data['qualification'],
            State_Medical_Council=data['State_Medical_Council'],
            specialization=data['specialization']
        )
        return Response({'message': 'Doctor registered successfully'}, status=status.HTTP_201_CREATED)
    except KeyError as e:
        return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    user = request.user
    role = 'unknown'
    profile_data = {}
    
    if hasattr(user, 'patient'):
        role = 'patient'
        profile_data = {
            'name': user.patient.name,
            'dob': user.patient.dob,
            'address': user.patient.address,
            'mobile_no': user.patient.mobile_no,
            'gender': user.patient.gender
        }
    elif hasattr(user, 'doctor'):
        role = 'doctor'
        profile_data = {
            'name': user.doctor.name,
            'specialization': user.doctor.specialization,
            'rating': user.doctor.rating
        }
    elif user.is_superuser:
        role = 'admin'
        
    return Response({
        'username': user.username,
        'email': user.email,
        'role': role,
        'profile': profile_data
    })
