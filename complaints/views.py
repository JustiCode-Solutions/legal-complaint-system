from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to the Online Legal Complaint System</h1><p>Aapki complaint yahan register hogi.</p>")
from django.shortcuts import render, redirect
from .models import Complaint

# Ye hai aapka mini AI logic
def suggest_category(description):
    description = description.lower()
    if 'online' in description or 'hack' in description or 'spam' in description:
        return 'Cyber Crime'
    elif 'land' in description or 'house' in description or 'property' in description:
        return 'Property Dispute'
    elif 'money' in description or 'bank' in description or 'cheat' in description:
        return 'Financial Fraud'
    else:
        return 'General'

def add_complaint(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        desc = request.POST.get('description')
        
        # AI se category poocho
        ai_category = suggest_category(desc)
        
        # Database mein save karo
        Complaint.objects.create(
            user=request.user, 
            title=title, 
            description=desc, 
            category=ai_category
        )
        return render(request, 'complaints/success.html', {'category': ai_category})
    
    return render(request, 'complaints/add_complaint.html')