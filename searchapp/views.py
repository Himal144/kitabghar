from django.shortcuts import render
from django.http import HttpResponse,HttpRequest
from .forms import searchform
from .models import searchmodel
from django.views import View
from bookinfo.models import Bookinfo
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from .models import searchmodel
from bookinfo.models import Cateogory
# Create your views here.
class book_form(View):
      def get(self, request,):
        title = request.GET.get('Title')
        category = request.GET.get('category')
        similar_books=Bookinfo.objects.filter(category=category).exclude(seller_id=request.user.id)
        books=Bookinfo.objects.filter(category=category)
        matching_books = process.extractBests(title, [book.title for book in books], scorer=fuzz.ratio, )
        book_title = [match[0] for match in matching_books if match[1] >= 40]
        filter_books = books.filter(title__in=book_title).exclude(seller_id=request.user.id)
        similar_books = similar_books.exclude(title__in=book_title)
        if request.user.is_authenticated:
          if not filter_books:
              category=Cateogory.objects.get(id=category)
              obj=searchmodel()
              obj.Title=title
              obj.user=request.user
              obj.category=category
              obj.book_id=0
              obj.save()
        context ={'search_books':filter_books,"similar_books":similar_books}
        return render (request,"search_result.html",context)
        
      def post(self, request, *args, **kwargs):
          pass 