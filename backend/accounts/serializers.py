from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SavedCalculator
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True, error_messages={
        "blank": "Nazwa nie może być pusta",
        "required": "Błąd przesłania danych [name]",
    })
    email = serializers.EmailField(required=True, error_messages={
        "blank": "Email nie może być pusty",
        "required": "Błąd przesłania danych [email]",
        "invalid": "Email jest błędny",
    })
    password = serializers.CharField(write_only=True, required=True, error_messages={
        "blank": "Hasło nie może być puste",
        "required": "Błąd przesłania danych [password]",
    })
    repeatPassword = serializers.CharField(write_only=True,required=True, error_messages={
        "blank": "Należy powtórzyć hasło",
        "required": "Błąd przesłania danych [repeatPassword]",
    })

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'repeatPassword']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ten email jest już zajęty")
        return value

    def validate(self, data):
        if data['password'] != data['repeatPassword']:
            raise serializers.ValidationError("Hasła nie są takie same")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('repeatPassword')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=password,
            first_name=validated_data['name'],
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, error_messages={
        "blank": "Email nie może być pusty",
        "required": "Błąd przesłania danych [email]",
        "invalid": "Email jest błędny",
    })
    password = serializers.CharField(required=False, write_only=True, error_messages={
        "blank": "Hasło nie może być puste",
        "required": "Błąd przesłania danych [password]",
    })

    def validate(self, data):
        email = (data.get("email") or "").strip()
        password = (data.get("password") or "").strip()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "email": "Użytkownik nie istnieje"
            })

        user = authenticate(username=user.username, password=password)
        if not user:
            raise serializers.ValidationError({
                "password": "Błędne hasło"
            })

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

class AdminUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'username', 'email', 'is_staff', 'is_superuser', 'is_active']

class UserSavedCalculatorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedCalculator
        fields = ['id', 'data', 'updated_at']

class AdminSavedCalculatorsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = SavedCalculator
        fields = ['id', 'user', 'user_email', 'data', 'updated_at']
