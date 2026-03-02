from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .views import load_drug_mapping

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def search_medicine(request):
    disease_name = request.data.get('diseaseName', '').lower()
    if not disease_name:
        return Response({'error': 'diseaseName is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    drug_mapping = load_drug_mapping()
    drug = drug_mapping.get(disease_name, None)
    
    return Response({'drug': drug})
