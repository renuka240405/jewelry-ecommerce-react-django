from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from django.contrib.auth.models import User

from rest_framework_simplejwt.views import TokenObtainPairView



# LOGIN VIEW

class LoginView(TokenObtainPairView):
    pass




# REGISTER VIEW

class RegisterView(APIView):

    permission_classes = [AllowAny]


    def post(self, request):

        username = request.data.get("username")

        password = request.data.get("password")


        user = User.objects.create_user(

            username=username,

            password=password

        )


        return Response({

            "username": user.username

        })