from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import SavedCalculator, UserCounter
from .serializers import RegisterSerializer, UserSavedCalculatorsSerializer, LoginSerializer, AdminSavedCalculatorsSerializer, AdminUsersSerializer
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            UserCounter.objects.create(user=user)
            return Response({
                "message": "Użytkownik utworzony",
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response (serializer.errors, status=400)
        user = serializer.validated_data["user"]
        counter, created = UserCounter.objects.get_or_create(user=user)
        counter.login_amount += 1
        counter.save()
        return Response ({
            "access": serializer.validated_data["access"],
            "refresh": serializer.validated_data["refresh"],
        }, status=200)

class NameView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
        })

class AdminUsersViewSet(ModelViewSet):
    queryset = User.objects.all().order_by('email')
    serializer_class = AdminUsersSerializer
    permission_classes = [IsAdminUser]

class UserSavedCalculatorsViewSet(ModelViewSet):
    serializer_class = UserSavedCalculatorsSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return SavedCalculator.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminSavedCalculatorsViewSet(ModelViewSet):
    queryset = SavedCalculator.objects.all().order_by('id')
    serializer_class = AdminSavedCalculatorsSerializer
    permission_classes = [IsAdminUser]

class UserReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        counter, created = UserCounter.objects.get_or_create(user=request.user)
        return Response({
            "login_amount": counter.login_amount,
            "calculator_amount": counter.calculator_amount,
        })

class AdminReportView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        users = User.objects.all()
        data = []
        for user in users:
            counter, created = UserCounter.objects.get_or_create(user=user)
            data.append({
                "user_id": user.id,
                "user_email": user.email,
                "login_amount": counter.login_amount,
                "calculator_amount": counter.calculator_amount
            })
        return Response(data)
