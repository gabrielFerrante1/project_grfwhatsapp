from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.tokens import RefreshToken

from accounts.auth import Authentication
from accounts.serializers import CustomTokenObtainPairSerializer


class SigninView(APIView, Authentication):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        signin = self.signin(email, password)

        if not signin:
            raise AuthenticationFailed

        refresh = CustomTokenObtainPairSerializer.get_token(signin)

        user = {
            'id': signin.id,
            'avatar': signin.avatar,
            'name': signin.name,
            'email': signin.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response({"user": user})


class SignupView(APIView, Authentication):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        if not name or not email or not password:
            raise AuthenticationFailed

        signup = self.signup(name, email, password)

        if not signup:
            raise AuthenticationFailed

        refresh = CustomTokenObtainPairSerializer.get_token(signup)

        user = {
            'id': signup.id,
            'avatar': signup.avatar,
            'name': signup.name,
            'email': signup.email,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response({"user": user})
