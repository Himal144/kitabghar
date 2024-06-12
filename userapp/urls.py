from .views import edit_profile,delete_profile,edit_profile_photo
from . import views
from bookinfo.views import booked_books,cancel_book
from userapp.views import notification
from django.urls import path
from django.contrib.auth import views as auth_views
 


urlpatterns = [
    path("login/",views.login_form, name= "login"),
    path("signup/",views.signup_form , name = "signup"),
    path("logout/",views.user_logout,name = "logout"),
    path("logout/",auth_views.LogoutView.as_view(),name = "logout"),
    path("profile/",views.profile_view.as_view(),name = "profile"),
    path("edit-profile/",edit_profile),
    path("delete-profile/",delete_profile),
    path("booked-book/",booked_books.as_view()),
    path("cancel-book/",cancel_book.as_view()),
    path("notification/",notification.as_view()),
    path("edit-profile-photo/",edit_profile_photo),
    #urls for the email reset password
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='reset_password/password_reset.html'),name='password_reset'),

    path('password_reset_done/',auth_views.PasswordResetDoneView.as_view(template_name='reset_password/password_reset_done.html'),name='password_reset_done'),

    path('password_reset_confirm/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='reset_password/password_reset_confirm.html'),name='password_reset_confirm'),

    path("password_reset_complete/", auth_views.PasswordResetCompleteView.as_view(template_name="reset_password/password_reset_complete.html"),name='password_reset_complete')
    ]