from django.contrib import admin
from .models import SavedCalculator, UserCounter

@admin.register(SavedCalculator)
class SavedCalculatorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'created_at')

@admin.register(UserCounter)
class UserCounterAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_amount', 'calculator_amount')
