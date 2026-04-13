from django.contrib import admin
from .models import SavedCalculator, UserCounter, CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'is_admin', 'is_active')

@admin.register(SavedCalculator)
class SavedCalculatorAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_name', 'user', 'updated_at')
    def get_name(self, obj):
        return obj.data.get('name')

@admin.register(UserCounter)
class UserCounterAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_amount', 'calculator_amount')
    def calculator_amount(self, obj):
        return obj.user.savedcalculator_set.count()
