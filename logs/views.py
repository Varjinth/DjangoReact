from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, TripSerializer, ApproveTripSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Trip
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed



class RegisterView(APIView):
    def post(self, request):
        data=request.data
        data["username"] = data["email"]
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        

        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "Login successful",
                "role": user.role,
            })
            response.set_cookie(
                key="access_token", 
                value=str(refresh.access_token),
                httponly=True, 
                secure=False,    
                samesite="Lax"
            )
            response.set_cookie(
                key="refresh_token", 
                value=str(refresh),
                httponly=True, 
                secure=False,    
                samesite="Lax"
            )
            response.set_cookie(
                key="role", 
                value=user.role,
                httponly=False, 
                secure=False,    
                samesite="Lax"
            )
            return response
         
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class TripListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("i am here",request.user.role)
        if request.user.role == 'admin':
            trips = Trip.objects.all()  
        else:
            trips = Trip.objects.filter(user=request.user) 

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    def post(self, request):
        
        data = request.data
        data['user'] = request.user.id
        serializer = TripSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ApproveTripAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can approve trips'}, status=status.HTTP_403_FORBIDDEN)

        trip = get_object_or_404(Trip, pk=pk)
        serializer = ApproveTripSerializer(trip, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Trip approved successfully', 'data': serializer.data})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response



def check_authentication(request):
    auth = JWTAuthentication()
    raw_token = request.COOKIES.get("access_token")

    if not raw_token:
        return JsonResponse({"authenticated": False, "error": "No token provided"}, status=401)

    try:
        validated_token = auth.get_validated_token(raw_token)
        user = auth.get_user(validated_token)
        return JsonResponse({"authenticated": True, "role": user.role})
    except AuthenticationFailed:
        return JsonResponse({"authenticated": False, "error": "Invalid token"}, status=401)
