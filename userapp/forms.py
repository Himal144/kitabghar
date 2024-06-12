
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm
from django import forms
from .models import userinfomodel
from django.forms import ModelForm


class signupform(UserCreationForm):
	password1 = forms.CharField(label='password', widget=forms.PasswordInput(attrs={'class':'form-control'}))
	password2 = forms.CharField(label='Confirm password', widget=forms.PasswordInput(attrs={'class':'form-control'}))
	class Meta:	
		model = User
		 
		fields = [ 'username','email',]
		labels ={'email':"Email"}

	def __init__(self,*args,**kwargs):
			super().__init__(*args,**kwargs)
			for field in self.fields.values():
				field.widget.attrs.update({'class':'form-control my-1','placeholder':field.label})
 
class userinfoform(ModelForm):
	class Meta:
		model = userinfomodel	
		exclude=['user','Profile_photo','Register_date']

	def __init__(self,*args,**kwargs):
			super().__init__(*args,**kwargs)
			for field in self.fields.values():
				field.widget.attrs.update({'class':'form-control'})
		 	