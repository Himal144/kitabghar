from django.forms import ModelForm
from .models import searchmodel
from django import forms

class searchform(ModelForm):
	
	class Meta:
		model = searchmodel
		fields = ['Title','category']
                
	def __init__(self,*args,**kwargs):
            super().__init__(*args,**kwargs)
            for field in self.fields.values():
               field.widget.attrs.update({'class':'form-control'})		