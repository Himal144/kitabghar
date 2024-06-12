from . import views
from django.contrib import admin
from django.urls import path
app_name ="searchapp"
urlpatterns = [
    path("", views.book_form.as_view(), name="home"),
    path("search-result", views.book_form.as_view(), name="search-result"),
   
]

