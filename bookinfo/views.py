from django.shortcuts import render
from .forms import Bookform
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from django.views import View
from userapp.models import userinfomodel
from .models import Cateogory,Bookinfo,Bookedmodel,Soldbookmodel
from datetime import date
from django.forms.models import model_to_dict
import datetime
from searchapp.models import searchmodel
from fuzzywuzzy import fuzz
from fuzzywuzzy import process 
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from chatapp.models import Chatmodel
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class book_form(View):
    def get(self, request, ):
         userobj=userinfomodel.objects.get(user=request.user)
         userdata={
             "longitude":userobj.longitude,
             "latitude":userobj.latitude,
             "location":userobj.Address
             
         }
         form = Bookform()
         context = {"bookform":form,}
         return render(request,"book_form.html",context)
    
   
    def post(self, request, *args, **kwargs):
      
       fm = Bookform(request.POST, request.FILES)
       if fm.is_valid():
        bk= Bookinfo()
        title = fm.cleaned_data['title']
        description = fm.cleaned_data['description']
        original_price = fm.cleaned_data['original_price']
        selling_price = fm.cleaned_data['selling_price']
        condition = fm.cleaned_data['condition']
        category = fm.cleaned_data['category']
        latitude= fm.cleaned_data['latitude']
        longitude= fm.cleaned_data['longitude']
        location=fm.cleaned_data['location']
        added_date=date.today()
        image=fm.cleaned_data['image']
       
        seller=request.user
        bk.title=title
        bk.description=description
        bk.original_price=original_price
        bk.selling_price=selling_price
        bk.condition=condition
        bk.category=category
        bk.latitude=latitude
        bk.longitude=longitude
        bk.location=location
        bk.added_date=added_date
        bk.seller=seller
        bk.image=image
        bk.save()  
        messages.success(request,"Book posted successfully.")
        # code for the notification state change
        search_obj=searchmodel.objects.filter(category=category)
        email_for_notification=[]
        if search_obj:
            for obj in search_obj:
                similarity_ratio=fuzz.ratio(title,obj.Title)
                if similarity_ratio>=50:
                   obj.notification_status=False
                   obj.book_id=bk.id
                   obj.save()
                  # code for the email send for user
                   userobj=User.objects.values("email").get(id=obj.user.id)
                   useremail=userobj["email"]
                   email_for_notification.append(useremail)
                   

        context={
                "book":bk.title,
                'id':bk.id
            }
        
            
        html_content=render_to_string('mail.html',context)
        text_content= strip_tags(html_content)
        email=EmailMultiAlternatives(
            "Suggestion",
            text_content,
            settings.EMAIL_HOST_USER,
            email_for_notification
        )
        email.attach_alternative(html_content,"text/html")
        email.send()


        return HttpResponseRedirect("/profile")
        
  

@csrf_exempt     
def delete_book(request):
    id=request.POST.get("book_id")
    bookobj=Bookinfo.objects.get(id=id)
    bookobj.delete()
    messages.warning(request,'Book deleted successfully ')
    return JsonResponse({"data":id})
    
class book_detail(View):
    def get(self, request, id):
         
          data = Bookinfo.objects.get(id=id)
          user_id = data.seller
          seller = userinfomodel.objects.get(user_id=user_id)
          selleremail=User.objects.get(id=seller.user.id)
          context={"data":data,"seller":seller,"seller_email":selleremail}
          return render(request,"book_detail.html",context)
    

    def post(self, request, *args, **kwargs):
        return HttpResponse('POST request!')
    
class all_books(View):
    def get(self, request, category):
       category_id = Cateogory.objects.values_list('id', flat=True).filter(category=category).first()
       data=Bookinfo.objects.filter(category=category_id)
       context={"data":data,"Category":category}
       return render(request,"all_books.html",context)
    

    def post(self, request, *args, **kwargs):
        return HttpResponse('POST request!')
class edit_books(View):
    def get(self,request):
        try:
         id=request.GET['book_id']
         data=Bookinfo.objects.get(id=id)
         json_data={
             "title":data.title,
             "description":data.description,
             "original_price":data.original_price,
             "selling_price":data.selling_price,
             "condition":data.condition,
             "latitude":data.latitude,
             "longitude":data.longitude,
             "location":data.location
         }
         if data.image:
             json_data['image_url'] = data.image.url
        except Bookinfo.DoesNotExist:
         return JsonResponse({'error': 'Book not found'}, status=404)     
        return JsonResponse(json_data)
    def post(self, request, *args, **kwargs):
        return HttpResponse('POST request!')    
       

# code to book book
class book_book(View):
    def get(self,request):
        email_for_notification=[]
        if  request.user.is_authenticated:
            book_id=request.GET["book_id"]
            bookobj=Bookinfo.objects.get(id=book_id)
            userid=bookobj.seller
            bookname=bookobj.title
            selleremail=User.objects.values("email").get(id=userid.id)
            selleremail=selleremail["email"]
            email_for_notification.append(selleremail)
            date=datetime.date.today()
            obj=Bookedmodel()
            obj.buyer_id=request.user
            obj.book_id=Bookinfo.objects.get(id=book_id)
            obj.booked_request_date=date
            obj.save()
            messages.success(request,"Book booked successfully.")
            userobj=userinfomodel.objects.get(user=request.user)
            # code for sending the email to the seller 
            context={
                "buyer_name":userobj.Name,
                "bookname":bookname
            }
            
            html_content=render_to_string('buy_mail.html',context)
            text_content= strip_tags(html_content)
            email=EmailMultiAlternatives(
            "Suggestion",
            text_content,
            settings.EMAIL_HOST_USER,
            email_for_notification
            )
            email.attach_alternative(html_content,"text/html")
            email.send()

            return JsonResponse({'data':'done'})
        else:
            messages.warning(request,"Login required to buy a book.")
            return JsonResponse({'error': 'authentication_required', 'redirect_url': '/login/'}, status=401)

   

class activebooks(View):
    def get (self,request):
        activebooks_queryset = Bookinfo.objects.filter(seller_id=request.user.id)
        booked_book_id=Bookedmodel.objects.values("book_id")
        id_list = [item['book_id'] for item in booked_book_id]
       
        modified_activebooks = []

        for book in activebooks_queryset:
    # Create a dictionary with the original attributes and the extra attribute
            id=book.id
            
            if id in id_list:
                book_book=Bookedmodel.objects.get(book_id=id)
                buyer_name=userinfomodel.objects.values("Name").get(user_id=book_book.buyer_id)
                chat_notification_count=Chatmodel.objects.filter(booked_id=book_book,view_status=None).exclude(sender_id=request.user).count()
                modified_book = {
                        'id':id,
                       'title': book.title,
                       'buyer_name':buyer_name["Name"],
                       'status':book_book.booked_status,
                       'price':book.selling_price,
                       'posted_date':book.added_date,
                       'booked_id':book_book.id,
                       'chat_notification_count':chat_notification_count
                                  }
            else:
                modified_book = {
                        'id':id,
                       'title': book.title,
                       'price':book.selling_price,
                       'posted_date':book.added_date
                      
                                  }
            modified_activebooks.append(modified_book)
        return JsonResponse(modified_activebooks, content_type='application/json', safe=False)

    
class Pending_books(View):
    def get(self,request):
        id=request.GET["book_id"]
        obj=Bookedmodel.objects.get(book_id=id)
        obj.booked_status=True
        obj.save()
        data={
            "data":"done"
        }
        return JsonResponse(data,content_type='application/json',safe=False) 

class Restore_books(View):
    def get(self,request):
        id=request.GET["book_id"]
        obj=Bookedmodel.objects.get(book_id=id)
        obj.delete()
        data={
            "data":"done"
        } 
        return JsonResponse(data,content_type='application/json',safe=False)   


       
class booked_books(View):
    def get(self,request):
        obj=Bookedmodel.objects.filter(buyer_id=request.user.id).values("book_id")
        id_list=[list["book_id"] for list in obj]
        modified_bookedbooks=[]
        for id in id_list:
          book_obj=Bookinfo.objects.get(id=id)
          booked_obj=Bookedmodel.objects.get(book_id=id)
          user_id=book_obj.seller
          user_obj=userinfomodel.objects.get(user_id=user_id)
          chat_notification_count=Chatmodel.objects.filter(booked_id=booked_obj.id,view_status=None).exclude(sender_id=request.user).count()
          modified_books={
              "title":book_obj.title,
              "seller":user_obj.Name,
              "contact_no":user_obj.Phone_Number,
              "latitude":book_obj.latitude,
              "longitude":book_obj.longitude,
              "location":book_obj.location,
              "price":book_obj.selling_price,
              "booked_status":booked_obj.booked_status,
              "booked_id":booked_obj.id,
              "chat_notification_count":chat_notification_count
          }
          modified_bookedbooks.append(modified_books)
        return JsonResponse({"data":modified_bookedbooks},content_type="application/json",safe=False)      
       
class cancel_book(View):
    def get(self,request):
        id=request.GET["booked_id"]
        obj=Bookedmodel.objects.get(id=id)
        obj.delete()
        return JsonResponse({"data":id},content_type="application/json",safe=False)      
           
@csrf_exempt
def sold_book(request):
    if request.method=="POST":
        book_id=request.POST.get("book_id")
        bookobj=Bookinfo.objects.values("title","added_date","selling_price").get(id=book_id)
        bookname=bookobj["title"]
        addeddate=bookobj["added_date"]
        selling_price=bookobj["selling_price"]
        todaydate=datetime.date.today()
        postedduration = todaydate - addeddate
        postedduration=postedduration.days
        buyerid=Bookedmodel.objects.values("buyer_id").get(book_id=book_id)
        buyerid=buyerid["buyer_id"]
        buyername=userinfomodel.objects.values("Name").get(user=buyerid)
        buyername=buyername["Name"]
        soldbookobj=Soldbookmodel()
        soldbookobj.user_id=request.user
        soldbookobj.bookname=bookname
        soldbookobj.sellingprice=selling_price
        soldbookobj.buyername=buyername
        soldbookobj.postedduration=postedduration
        soldbookobj.save()
        bookobj=Bookinfo.objects.get(id=book_id)
        bookedobj=Bookedmodel.objects.get(book_id=book_id)
        # bookobj.delete()
        # bookedobj.delete()
        return JsonResponse({"data":'done'})

    if request.method== "GET":
        soldbookobj=Soldbookmodel.objects.filter(user_id=request.user.id)
        soldbookdata=[]
        for soldbook in soldbookobj:
            soldbooljson={
                "bookname":soldbook.bookname,
                "postedduration":soldbook.postedduration,
                "sellingprice":soldbook.sellingprice,
                "buyername":soldbook.buyername
            }
            soldbookdata.append(soldbooljson)
        return JsonResponse({"data":soldbookdata})    


              