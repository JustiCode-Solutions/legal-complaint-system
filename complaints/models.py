from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    # User jo complaint kar raha hai
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    title = models.CharField(max_length=200)
    description = models.TextField()
    # Categorization jahan hum baad mein AI integrate karenge
    category = models.CharField(max_length=100, default='General') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title