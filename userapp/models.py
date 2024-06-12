from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_delete
from django.dispatch import receiver
import os
from django.core.validators import RegexValidator

   
class userinfomodel(models.Model):

    phone_regex = RegexValidator(
        regex=r'^\d{10}$',  # This regex allows exactly 10 digits.
        message="Phone number must be exactly 10 digits long.",
        code="invalid_phone_number"
    )
    Name = models.CharField(max_length=50)
    Phone_Number = models.CharField(max_length=10,validators=[phone_regex],
        verbose_name="Phone Number")
    Address = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Profile_photo = models.ImageField(upload_to=("user/images"),max_length=None,null=True,default='user_icon.png')
    latitude = models.FloatField()
    longitude = models.FloatField()
    Register_date = models.DateField()

    
@receiver(pre_delete,sender=userinfomodel)
def delete_user_photo(sender,instance,**kwargs): 
    if instance.Profile_photo:
        if os.path.isfile(instance.Profile_photo.path):
            os.remove(instance.Profile_photo.path)

    
   
   