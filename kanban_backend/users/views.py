from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        data=request.data
        serializer=RegisterSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'msg':"Registration Successfully.🎉"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self,request):
        data=request.data

        username=data.get('username')
        password=data.get('password')

        user=authenticate(username=username,password=password)
        if user:
            refresh=RefreshToken.for_user(user=user)
            return Response({"msg":"Login Successfully.🎉",
                'refresh_token':str(refresh),
                'access_token':str(refresh.access_token),
            },status=status.HTTP_200_OK)
        return Response({"msg":"Invalid Credentials."},status=status.HTTP_400_BAD_REQUEST)
    

class NewAccessToken(APIView):
    def post(self,request):
        refresh_token=request.data.get('refresh')
        if not refresh_token:
            return Response({"msg":"RefreshToken is Needed.."},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh=RefreshToken(refresh_token)
            new_access_token=str(refresh.access_token)
            return Response({"access_token":new_access_token},status=status.HTTP_200_OK)
        except TokenError:
            return Response({"msg": "Invalid or expired refresh token"},status=status.HTTP_401_UNAUTHORIZED)
        

class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        users=User.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)