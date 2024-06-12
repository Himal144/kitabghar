from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Chatmodel
from django.views import View
from django.db.models import Q
from django.http import JsonResponse
from datetime import datetime
from bookinfo.models import Bookedmodel
from userapp.models import userinfomodel
from bookinfo.models import Bookinfo

# Create your views here.
class chatView(View):
    def get(self,request):
       conversation=[]
       id_list=[]
       booked_id=request.GET.get("booked_id")
       chatConversation=Chatmodel.objects.filter(booked_id=booked_id).order_by("date_time")
       chatNotification=0
       id=Bookedmodel.objects.values("buyer_id").get(id=booked_id)
       id=id["buyer_id"]
       id_list.append(id)
       book_id=Bookedmodel.objects.values("book_id").get(id=booked_id)
       book_id=book_id["book_id"]
       user_id=Bookinfo.objects.values("seller").get(id=book_id)
       user_id=user_id["seller"]
       id_list.append(user_id)

       for data in chatConversation:
           chat={
            "message":data.message,
            "sender_id":data.sender_id.id  
           }
           conversation.append(chat)
           if(data.view_status is None):
               chatNotification=chatNotification+1
          
 
       sender_id=0
       for item in id_list:
           if item!=request.user.id:
               sender_id=item
          
       userobj=userinfomodel.objects.get(user=sender_id)
       sender_name=userobj.Name
       sender_photo=userobj.Profile_photo.url
          
       response={
           "conversation":conversation,
           "user_id":request.user.id,
           "chatNotification":chatNotification, 
           "sender_info":{
               "sender_name":sender_name,
               "sender_photo":sender_photo
           }    
       }
       
      
       return JsonResponse(response)

    def post(self,request):
        booked_id=request.POST.get("booked_id")
        bookobj=Bookedmodel.objects.get(id=booked_id)
        message=request.POST.get("message")
        obj=Chatmodel()
        obj.booked_id=bookobj
        obj.message=message
        obj.sender_id=request.user
        obj.date_time=datetime.now()
        obj.view_status=None
        obj.save()
       
        return JsonResponse({"data":"done"})