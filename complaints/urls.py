from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('add/', views.add_complaint, name='add_complaint'),
    path('citizen/', views.add_complaint, name='citizen_portal'),
]
