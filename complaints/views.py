from django.shortcuts import render, redirect
from .models import Complaint

#  AI logic 
def suggest_category(description):
    description = description.lower()
    if 'online' in description or 'hack' in description:
        return 'Cyber Crime'
    elif 'land' in description or 'property' in description:
        return 'Property Dispute'
    elif 'money' in description or 'bank' in description:
        return 'Financial Fraud'
    return 'General'

# 1. Home page Sriparna design show
def home(request):
    return render(request, 'complaints/index.html')

# 2. Citizen Portal jahan user complaint likhega
def add_complaint(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        desc = request.POST.get('description')
        
        # AI se category 
        ai_category = suggest_category(desc)
        
        # Database mein save karein
        Complaint.objects.create(title=title, description=desc, category=ai_category)
        
        # Success page par category ke saath bhejein
        return render(request, 'complaints/success.html', {'category': ai_category})
    
    return render(request, 'complaints/citizen-portal.html')
