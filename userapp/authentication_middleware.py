from django.shortcuts import redirect
from django.urls import reverse

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
       
        # Check if the requested URL starts with /profile/
        if request.path.startswith('/profile/'):
            # Check if the user is authenticated
            if not request.user.is_authenticated:
                
                # Redirect to the login page
                return redirect(reverse('login'))  # Replace 'login' with your login URL name
            

        response = self.get_response(request)
        return response
