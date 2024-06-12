from . import views
from django.contrib import admin
from django.urls import path
from .views import delete_book,sold_book



urlpatterns = [
    path("post-book/", views.book_form.as_view() , name='bookinfo'),
    path("editbook/",views.edit_books.as_view(),name="editbook"),
    path("book-book/",views.book_book.as_view(),name='book_book'),
    path("activebooks/",views.activebooks.as_view(),name='activebooks'),
    path("pending-request/",views.Pending_books.as_view(),name='pendingrequest'),
    path("restore-request/",views.Restore_books.as_view(),name="restorebooks"),
    path("delete-book/",delete_book,name="deletebook"),
    path("sold-book/",sold_book,name="soldbook")
] 
