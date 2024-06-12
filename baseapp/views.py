from django.shortcuts import render
from bookinfo.models import Bookinfo
from userapp.models import userinfomodel
from bookinfo.models import Cateogory
from searchapp.forms import searchform
from django.core.paginator import Paginator
from django.contrib.messages import get_messages
from django.http import JsonResponse
from django.shortcuts import render
from bookinfo.models import Bookedmodel
from searchapp.models import searchmodel
from collections import Counter
import random


def form_view(request):
    categories = list(Cateogory.objects.all())
    random.shuffle(categories)
    categories=categories[:4]
    filter_books = []
    recommended_list=[]
    if request.user.is_authenticated:
        recommended_book_id=[]
        for category in categories:
            books = Bookinfo.objects.filter(category=category).exclude(seller=request.user).order_by('-added_date')[:4]
            if books:
                books=list(books)
                random.shuffle(books)
                paginator = Paginator(books, 4)  # Display 4 books per page initially
                page_number = request.GET.get('page')
                books = paginator.get_page(page_number)
                filter_books.append({'category': category, 'books': books})

            # code for the recommended section
        search_books_obj=searchmodel.objects.filter(user_id=request.user).exclude(book_id=0)
        for obj in search_books_obj:
            recommended_book_id.append(obj.book_id)
        search_books_category_obj=searchmodel.objects.filter(user_id=request.user)
        search_books_category=[]
        for obj in search_books_category_obj:
            search_books_category.append(obj.category)
        search_books_category_counts=Counter(search_books_category)
        sorted_category = sorted(search_books_category_counts, key=lambda x: (-search_books_category_counts[x], x))
        for category in sorted_category:
            latest_book=Bookinfo.objects.filter(category=category).exclude(seller=request.user).order_by('-added_date').first()
            if latest_book:
                recommended_book_id.append(latest_book.id) 
        if  len(recommended_book_id)<4:
            category=Cateogory.objects.all()
            category_length=len(category)
            all_numbers = list(range(1, category_length+1))
            random.shuffle(all_numbers)
            while all_numbers:
                random_id = all_numbers.pop()
                latest_book=Bookinfo.objects.filter(category__id=random_id).exclude(seller=request.user).order_by('-added_date').first()
                if latest_book:
                    recommended_book_id.append(latest_book.id) 
        book_id_counts=Counter(recommended_book_id)
        sorted_book_id = sorted(book_id_counts, key=lambda x: (-book_id_counts[x], x))

        for book_id in sorted_book_id:
            recommended_book_obj=Bookinfo.objects.filter(id=book_id)
            if recommended_book_obj:
                recommended_list.append(recommended_book_obj)
        paginator = Paginator(recommended_list, 8)  # Display 4 books per page initially
        page_number = request.GET.get('page')
        recommended_list = paginator.get_page(page_number)        
        
    else:
        for category in categories:
            books = Bookinfo.objects.filter(category=category).order_by('-added_date')[:4]
            if books:
                books=list(books)
                random.shuffle(books)
                paginator = Paginator(books, 4)  # Display 4 books per page initially
                page_number = request.GET.get('page')
                books = paginator.get_page(page_number)
                filter_books.append({'category': category, 'books': books})
    form = searchform()
    context={}
    if request.user.is_authenticated:
        context = {"filter_books": filter_books, "form": form,"recommended_books":recommended_list}
    else:
        context = {"filter_books": filter_books, "form": form}
   
    return render(request, "baseapp/home.html", context)
   
def about_us(request):
    if request.user.is_authenticated:
       
        return render(request,"baseapp/about_us.html",)
    
def messages(request):
    
    message_list = list(get_messages(request))
    message_list_with_header=[]
    for message in message_list:
        message_list_with_header.append(
            {
                "header":message.level_tag,
                "message":message.message
            }
        )
        
    return JsonResponse({'messages': message_list_with_header})    

