from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
import csv

def load_drug_mapping():
    drug_mapping = {}
    csv_path = os.path.join(settings.BASE_DIR, 'medicine', 'final.csv')
    with open(csv_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            drug_mapping[row['disease'].strip().lower()] = row['drug'].strip()
    return drug_mapping

def medicine_page(request):
    return render(request, 'medicine/medicine_page.html')

@csrf_exempt
def medicine_search(request):
    if request.method == 'POST':
        disease_name = request.POST.get('diseaseName', '').lower()
        drug_mapping = load_drug_mapping()
        drug = drug_mapping.get(disease_name, None)
        if drug:
            return JsonResponse({'drug': drug})
        else:
            return JsonResponse({'drug': None})
    return JsonResponse({'error': 'Invalid request'}, status=400)
