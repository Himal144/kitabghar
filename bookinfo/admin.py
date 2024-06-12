from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(Bookinfo)
admin.site.register(Cateogory)
admin.site.register(Bookedmodel)
admin.site.register(Soldbookmodel)