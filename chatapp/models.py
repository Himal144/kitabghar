from django.db import models
from bookinfo.models import Bookedmodel
from django.contrib.auth.models import User

# Create your models here.
class Chatmodel(models.Model):
    booked_id=models.ForeignKey(Bookedmodel,on_delete=models.CASCADE)
    message=models.TextField()
    sender_id=models.ForeignKey(User,on_delete=models.CASCADE)
    date_time=models.DateTimeField()
    view_status=models.BooleanField(default=None,null=True)
