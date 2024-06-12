from . import views
from django.contrib import admin
from django.urls import path
from bookinfo.views import book_detail,all_books
from .views import messages


urlpatterns = [
    path("",views.form_view, name= "home"),
    path("aboutus/" ,views.about_us, name="aboutus"),
    path("book-detail/<int:id>", book_detail.as_view(), name="book_detail"),
    path("books/<str:category>",all_books.as_view(),name="books"),
    path("get-messages/",messages,name="get_messages")
]

