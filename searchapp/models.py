from django.db import models
from django import forms 
from django.contrib.auth.models import User
from bookinfo.models import Cateogory

class searchmodel(models.Model):
    Title=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    category=models.ForeignKey(Cateogory,on_delete=models.CASCADE)
    notification_status=models.BooleanField(null=True)
    book_id=models.IntegerField(null=True)
    
    def __str__(self):
        return(self.Title)