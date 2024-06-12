from django.shortcuts import render,redirect
from django.contrib import messages
from .forms import signupform
from django.contrib.auth.models import User
from bookinfo.models import Cateogory,Bookinfo,Bookedmodel
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate , login , logout 
from django.http import HttpResponseRedirect 
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect,HttpResponse
from django.views import View
from .forms import userinfoform
from .models import userinfomodel
from django.http import JsonResponse
from bookinfo.forms import editBookform
from django.core.files.storage import default_storage
from searchapp.models import searchmodel
from datetime import datetime
from bookinfo.models import Soldbookmodel
import json

#  Create your views here.
def login_form(request):
    if request.method == 'POST':
        fm = AuthenticationForm(request=request, data=request.POST)
        if fm.is_valid():
            uname = fm.cleaned_data['username']
            upass = fm.cleaned_data['password']
            user= authenticate(username=uname,password=upass)
            if user is not None:
                login(request,user)
                messages.success(request,'Logged in succesfully')
                return HttpResponseRedirect("/")
            else:
                messages.warning(request,"Invalid Username or password")      
                
        else:
            messages.warning(request,"Invalid Username or password")      
                
    fm = AuthenticationForm()   
    context = {"loginform":fm}
    return render(request,"userapp/login_form.html",context)
def signup_form(request):
    if request.method == "POST":
        fm = signupform(request.POST)
        if fm.is_valid():
           
            fm.save()
            messages.success(request,'Account Created successfully ')
            fm = AuthenticationForm()   
            context = {"loginform":fm}
            return redirect("/login/")
            
        else:
        #   errors=fm.errors
        #   for field, error_messages in errors.items():
        #         for error_message in error_messages:
        #             messages.warning(request, f"{field}: {error_message}")
          return render(request,"userapp/signup_form.html",{'signupform':fm})
    else:    
       fm = signupform()
       return render (request,'userapp/signup_form.html',{'signupform':fm})


def user_logout(request):
    logout(request)
    messages.warning(request,"Log out succefully")
    return HttpResponseRedirect('/')

class profile_view(View):
    def get(self, request, ):
        if request.user.is_authenticated:
          email = request.user.email
          fm=userinfoform()
          bfm=editBookform(prefix='bookform')
          #code for the activebooks count
          activebooks=Bookinfo.objects.filter(seller=request.user)
          activebooks_count=activebooks.count()
          #code for the bookedbooks count
          bookedbooks=Bookedmodel.objects.filter(buyer_id=request.user)
          bookedbooks_count=bookedbooks.count()

          soldbookobj=Soldbookmodel.objects.filter(user_id=request.user)
          soldbookcount=0
          for soldbook in soldbookobj:
              soldbookcount=soldbookcount+1
          
          context={"email":email,"userform":fm,"bookform":bfm,"activebooks_count":activebooks_count,"bookedbooks_count":bookedbooks_count,"soldbooks_count":soldbookcount}
          return render(request,"profile.html",context)

          

    def post(self, request, *args, **kwargs):
        # fm = userinfoform(request.POST,request.FILES)
        # if fm.is_valid():
           
        #     fm.save()
        #     return HttpResponse('POST request!')
        pass
        
@csrf_exempt
def edit_profile(request):
    if request.method=="POST":
        Name = request.POST['Name']
        Phone_Number =request.POST['Phone_Number']
        latitude=request.POST['latitude']
        address=request.POST['address']
        longitude=request.POST['longitude']
        try:  
            obj=userinfomodel.objects.get(user_id=request.user)
            obj.Name = Name
            obj.Phone_Number = Phone_Number
            obj.Address=address
            obj.latitude=latitude
            obj.longitude=longitude
            obj.save()
       
        except userinfomodel.DoesNotExist:
                user=User.objects.get(id=request.user.id)  
                obj=userinfomodel()
                obj.Name = Name
                obj.Phone_Number = Phone_Number
                obj.Address=address
                obj.latitude=latitude
                obj.longitude=longitude
                obj.user=request.user
                obj.Register_date=user.date_joined.date()
                obj.save()
                
        messages.success(request,'Profile edited successfully')
        data = {
                'data': 'done'
        }
        return JsonResponse(data,content_type="application/json",safe=False)
    
@csrf_exempt
def delete_profile(request):
        userobj=User.objects.get(id=request.user.id)
        userobj.delete()
        messages.warning(request,"Account deleted successfully.")
        return JsonResponse({"data":"done"})
    
@csrf_exempt
def edit_profile_photo(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        user_id=request.user.id
        obj=userinfomodel.objects.get(user_id=user_id)
        if obj.Profile_photo:
            previous_photo_path = obj.Profile_photo.path
            if default_storage.exists(previous_photo_path):
                default_storage.delete(previous_photo_path)
        
        # Save the new photo file
        new_photo_path = f'user/images/{user_id}_{image_file.name}'
        default_storage.save(new_photo_path, image_file)
        
        # Update the Profile_photo field
        obj.Profile_photo.name = new_photo_path
        obj.save()
        messages.success(request,'Profile picture updated successfully ')
        image_url=obj.Profile_photo.url
        data={
            "image_url":image_url
        }
        return JsonResponse(data,content_type="application/json",safe=False)
@method_decorator(csrf_exempt, name='dispatch')
class notification(View):
    # notification for the searchstatus
    def get(self,request):
        request.session["notification_count"]=0
        request.session.save()
        obj=searchmodel.objects.filter(user_id=request.user)
        obj=obj.exclude(notification_status=None)
        json_search_notification_data=[]
        for obj in obj:
            search_notification_data={
            "title":obj.Title,
            "category":obj.category.category,
            "book_id":obj.book_id,
            "notification_status":obj.notification_status,
            "search_id":obj.id
             }
            obj.notification_status=False
            obj.save()
            json_search_notification_data.append(search_notification_data)

        # code for the activebooks pending notification
        json_pending_notification_data=[]
        obj=Bookedmodel.objects.all()
        for obj in obj:
            bookobj=Bookinfo.objects.get(id=obj.book_id.id)
            if(bookobj.seller==request.user):
                if(obj.booked_status==False):
                  
                    buyer=userinfomodel.objects.get(user_id=obj.buyer_id)
                    pending_notification_data={
                         "buyer_name":buyer.Name,
                         "book_name":bookobj.title,
                         "pending_id":obj.id
                    }
                    obj.notification_status=False
                    obj.save()
                    json_pending_notification_data.append(pending_notification_data)   
        json_notification_data={"search_notification":json_search_notification_data,"pending_notification":json_pending_notification_data}
       
        return JsonResponse(json_notification_data,content_type="application/json",safe=False)
    
   
    def post(self,request):
        try:
           
            search_id = request.POST.get('searchId')
            searchobj=searchmodel.objects.get(id=search_id)
            searchobj.delete()
            return JsonResponse({'message': 'DELETE request processed successfully'})
        except json.JSONDecodeError:
            messages.warning(request,"Sorry the book is not available")
            return JsonResponse({'error': 'Invalid JSON data in request'}, status=400)


