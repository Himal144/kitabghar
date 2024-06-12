from django.urls import path
from .views import chatView

urlpatterns = [
    path("chat/",chatView.as_view(),),
    path("send-chat/",chatView.as_view())
]
