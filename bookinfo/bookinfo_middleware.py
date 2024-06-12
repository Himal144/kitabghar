from django.shortcuts import redirect
from django.urls import reverse
from userapp.models import userinfomodel
from django.contrib import messages

class PostBookMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
       
        # Check if the requested URL starts with /profile/
        if request.path.startswith('/bookinfo/'):
            if request.user.is_authenticated:
               
                userobj=userinfomodel.objects.filter(user=request.user)
                if not userobj:
                    
                    messages.info(request,'You need to set your profile before posting the books.')
                    return redirect(reverse('profile'))  # Replace 'login' with your login URL name
            else:    
              messages.info(request,'You need to login before posting the books.')
              return redirect(reverse('login')) 
        response = self.get_response(request)
        return response