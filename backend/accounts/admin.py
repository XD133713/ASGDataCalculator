from django.contrib import admin
from .models import SavedCalculator

@admin.register(SavedCalculator)
class SavedCalculatorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'created_at')
    list_filter = ('user',)
    search_fields = ('name',)

@admin.register(SavedCalculator)
class UserCounterAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_amount', 'calculator')
    search_fields = ('user_email',)


