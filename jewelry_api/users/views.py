from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth.models import User

from rest_framework_simplejwt.views import TokenObtainPairView

class LoginView(TokenObtainPairView):
    pass


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


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "is_admin": request.user.is_staff
        })

    def put(self, request):

        user = request.user

        user.first_name = request.data.get(
            "first_name",
            user.first_name
        )

        user.last_name = request.data.get(
            "last_name",
            user.last_name
        )

        user.email = request.data.get(
            "email",
            user.email
        )

        user.save()

        return Response({
            "message": "Profile Updated"
        })    